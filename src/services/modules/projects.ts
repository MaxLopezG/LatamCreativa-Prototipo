import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    writeBatch,
    increment,
    onSnapshot,
    startAfter,
    QueryDocumentSnapshot,
    DocumentData
} from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { storageService } from './storage';
import { PortfolioItem } from '../../types';
import { PaginatedResult } from './utils';

export const projectsService = {
    /**
     * Creates a new project with robust transaction handling.
     * 1. Uploads cover image (if any)
     * 2. Uploads gallery images (if any)
     * 3. Atomically creates project doc and updates user stats
     */
    createProject: async (
        userId: string,
        projectData: Partial<PortfolioItem>,
        files: { cover?: File; gallery?: File[] },
        uploadOptions: { maxSizeMB: number }
    ): Promise<string> => {
        try {
            // 1. Generate ID first to create storage paths
            const newProjectRef = doc(collection(db, 'projects'));
            const projectId = newProjectRef.id;

            // 2. Upload Cover Image
            let coverUrl = '';
            if (files.cover) {
                const path = `users/${userId}/projects/${projectId}/cover.jpg`;
                coverUrl = await storageService.uploadImage(files.cover, path, uploadOptions);
            }

            // 3. Upload Gallery Images
            const galleryUrls: string[] = [];
            if (files.gallery && files.gallery.length > 0) {
                const uploadPromises = files.gallery.map(async (file, index) => {
                    // Unique names for gallery items
                    const timestamp = Date.now();
                    const path = `users/${userId}/projects/${projectId}/gallery/${timestamp}_${index}.jpg`;
                    return await storageService.uploadImage(file, path, uploadOptions);
                });
                const urls = await Promise.all(uploadPromises);
                galleryUrls.push(...urls);
            }

            // 4. Prepare Final Data
            const finalData = {
                ...projectData,
                domain: projectData.domain || 'creative', // Ensure domain is saved
                id: projectId,
                authorId: userId,
                image: coverUrl || projectData.image || '', // Prefer uploaded cover
                images: galleryUrls.length > 0 ? galleryUrls : (projectData.images || []),
                createdAt: new Date().toISOString(), // Store as string for easy serialization
                views: 0,
                likes: 0,
                artistUsername: (projectData as any).artistUsername || '',
                stats: { // Keep numeric stats for internal logic
                    viewCount: 0,
                    likeCount: 0
                }
            };

            // Remove undefined values
            Object.keys(finalData).forEach(key => (finalData as any)[key] === undefined && delete (finalData as any)[key]);

            // 5. Atomic Write (Batch)
            const batch = writeBatch(db);

            // Operation A: Create Project Document
            batch.set(newProjectRef, finalData);

            // Operation B: Increment User Project Count
            const userRef = doc(db, 'users', userId);
            batch.update(userRef, {
                'stats.projects': increment(1)
            });

            await batch.commit();

            return projectId;
        } catch (error) {
            console.error("Error creating project:", error);
            // NOTE: If batch fails, we might have orphaned files in Storage.
            // In a production env, a Cloud Function should clean up orphaned files periodically.
            throw error;
        }
    },

    /**
     * Deletes a project and updates user stats atomically.
     */
    deleteProject: async (userId: string, projectId: string): Promise<void> => {
        try {
            // 1. Delete Storage Files (Images) recursively
            // We attempt to clean up files first. If this fails partially, we still proceed to delete the DB record.
            const deleteFolder = async (path: string) => {
                const folderRef = ref(storage, path);
                try {
                    const list = await listAll(folderRef);
                    await Promise.all(list.items.map(item => deleteObject(item)));
                    await Promise.all(list.prefixes.map(prefix => deleteFolder(prefix.fullPath)));
                } catch (err) {
                    console.warn(`Storage cleanup warning for ${path}:`, err);
                }
            };
            await deleteFolder(`users/${userId}/projects/${projectId}`);

            const batch = writeBatch(db);

            // Operation A: Delete Project Document
            const projectRef = doc(db, 'projects', projectId);
            batch.delete(projectRef);

            // Operation B: Decrement User Project Count
            const userRef = doc(db, 'users', userId);
            batch.update(userRef, {
                'stats.projects': increment(-1)
            });

            await batch.commit();
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    },

    /**
     * Get paginated projects for the global feed.
     * Uses cursor-based pagination for performance.
     */
    getProjects: async (lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize: number = 20): Promise<PaginatedResult<PortfolioItem>> => {
        try {
            let q = query(
                collection(db, 'projects'),
                orderBy('createdAt', 'desc'),
                limit(pageSize)
            );

            if (lastDoc) {
                q = query(
                    collection(db, 'projects'),
                    orderBy('createdAt', 'desc'),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === pageSize
            };
        } catch (error) {
            console.error("Error fetching paginated projects:", error);
            throw error;
        }
    },

    /**
     * Fetch all projects for a specific user
     */
    getUserProjects: async (userId: string): Promise<PortfolioItem[]> => {
        try {
            // Strategy: Dual Query to support old (artistId) and new (authorId) items
            // We run both to ensure we catch legacy projects and newly created ones.
            const queries = [
                // 1. Query by authorId (Standard)
                query(
                    collection(db, 'projects'),
                    where('authorId', '==', userId),
                    orderBy('createdAt', 'desc')
                ),
                // 2. Query by artistId (Legacy/Compatibility)
                query(
                    collection(db, 'projects'),
                    where('artistId', '==', userId),
                    orderBy('createdAt', 'desc')
                )
            ];

            const snapshots = await Promise.all(queries.map(q => getDocs(q).catch(e => {
                console.warn("Error in partial project query (likely missing index):", e);
                return { docs: [] }; // Return empty result on individual query failure
            })));

            // Merge and Deduplicate
            const projectsMap = new Map<string, PortfolioItem>();

            snapshots.forEach(snapshot => {
                // @ts-ignore - snapshot type might vary slightly due to catch block mock return
                snapshot.docs.forEach((doc: any) => {
                    projectsMap.set(doc.id, { id: doc.id, ...doc.data() as object } as PortfolioItem);
                });
            });

            // Convert back to array and sort
            return Array.from(projectsMap.values()).sort((a, b) => {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return dateB - dateA;
            });

        } catch (error) {
            console.error("Error fetching user projects:", error);
            return [];
        }
    },

    /**
     * Get a single project by ID
     */
    getProject: async (projectId: string): Promise<PortfolioItem | null> => {
        try {
            const docRef = doc(db, 'projects', projectId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as PortfolioItem;
            }
            return null;
        } catch (error) {
            console.error("Error fetching project:", error);
            return null;
        }
    },

    /**
     * Get recent projects for the global feed
     */
    getRecentProjects: async (limitCount: number = 20): Promise<PortfolioItem[]> => {
        try {
            const q = query(
                collection(db, 'projects'),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
        } catch (error) {
            console.error("Error fetching recent projects:", error);
            return [];
        }
    },

    /**
     * Real-time listener for a user's projects
     */
    listenToUserProjects: (userId: string, callback: (projects: PortfolioItem[]) => void) => {
        const q = query(
            collection(db, 'projects'),
            where('authorId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
            callback(projects);
        });
    },

    // --- Interactions ---

    incrementProjectView: async (projectId: string): Promise<void> => {
        try {
            const ref = doc(db, 'projects', projectId);
            await updateDoc(ref, {
                'stats.viewCount': increment(1)
            });
        } catch (error) {
            console.error("Error incrementing view:", error);
        }
    },

    toggleProjectLike: async (projectId: string, userId: string): Promise<boolean> => {
        try {
            // Reference to the "like" document in a subcollection
            // This prevents a user from liking the same project twice
            const likeRef = doc(db, 'projects', projectId, 'likes', userId);
            const projectRef = doc(db, 'projects', projectId);

            const likeSnap = await getDoc(likeRef);
            const batch = writeBatch(db);
            let isLiked = false;

            if (likeSnap.exists()) {
                // Unlike: Remove doc and decrement counter
                batch.delete(likeRef);
                batch.update(projectRef, {
                    'stats.likeCount': increment(-1),
                    'likes': increment(-1)
                });
                isLiked = false;
            } else {
                // Like: Create doc and increment counter
                batch.set(likeRef, {
                    userId,
                    createdAt: new Date().toISOString()
                });
                batch.update(projectRef, {
                    'stats.likeCount': increment(1),
                    'likes': increment(1)
                });
                isLiked = true;
            }

            await batch.commit();
            return isLiked;
        } catch (error) {
            console.error("Error toggling like:", error);
            throw error;
        }
    },

    getProjectLikeStatus: async (projectId: string, userId: string): Promise<boolean> => {
        try {
            const likeRef = doc(db, 'projects', projectId, 'likes', userId);
            const snap = await getDoc(likeRef);
            return snap.exists();
        } catch (error) {
            return false;
        }
    }
};
