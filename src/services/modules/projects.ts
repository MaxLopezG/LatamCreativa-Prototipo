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
    addDoc,
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
        uploadOptions: {
            maxSizeMB: number;
            galleryMetadata?: { type: 'image' | 'video' | 'youtube'; caption?: string; fileIndex?: number; url?: string }[];
            onProgress?: (progress: number) => void;
        }
    ): Promise<string> => {
        try {
            // Initialize progress tracking
            const totalOps = (files.cover ? 1 : 0) + (files.gallery?.length || 0) + 1; // +1 for DB write
            let completedOps = 0;
            const updateProgress = () => {
                completedOps++;
                if (uploadOptions.onProgress) uploadOptions.onProgress(Math.round((completedOps / totalOps) * 100));
            };

            // 1. Generate ID first to create storage paths
            const newProjectRef = doc(collection(db, 'projects'));
            const projectId = newProjectRef.id;

            // 2. Upload Cover Image
            let coverUrl = '';
            if (files.cover) {
                const path = `users/${userId}/projects/${projectId}/cover.jpg`;
                coverUrl = await storageService.uploadImage(files.cover, path, uploadOptions);
                updateProgress();
            }

            // 3. Upload Gallery Images
            // We upload all files first, obtaining a list of URLs
            const uploadedUrls: string[] = [];
            if (files.gallery && files.gallery.length > 0) {
                const uploadPromises = files.gallery.map(async (file, index) => {
                    // Unique names for gallery items
                    const timestamp = Date.now();
                    const path = `users/${userId}/projects/${projectId}/gallery/${timestamp}_${index}.jpg`;
                    const url = await storageService.uploadImage(file, path, uploadOptions);
                    updateProgress();
                    return url;
                });
                uploadedUrls.push(...(await Promise.all(uploadPromises)));
            }

            // 4. Prepare Final Data
            // Construct detailed gallery array based on metadata + uploaded content
            let galleryObjects: any[] = [];

            if (uploadOptions.galleryMetadata) {
                // New logic: Use metadata to reconstruct order
                galleryObjects = uploadOptions.galleryMetadata.map(meta => {
                    if (meta.type === 'image' && meta.fileIndex !== undefined) {
                        return {
                            type: 'image',
                            caption: meta.caption || '',
                            url: uploadedUrls[meta.fileIndex] || ''
                        };
                    } else if (meta.type === 'youtube') {
                        return {
                            type: 'youtube',
                            caption: meta.caption || '',
                            url: meta.url || ''
                        };
                    }
                    return null;
                }).filter(Boolean);
            } else {
                // Backward compatibility: Map 1-to-1 with basic captions
                galleryObjects = uploadedUrls.map((url, index) => ({
                    type: 'image',
                    url,
                    caption: '' // galleryCaptions is deprecated
                }));
            }

            // Re-construct simple string array for legacy compatibility
            // Only include image URLs in the main 'images' array for compatibility with older viewers
            const legacyImages = galleryObjects
                .filter(item => item.type === 'image')
                .map(item => item.url);

            // Explicitly fetch and set the author's availability to ensure it's saved with the project.
            // This is a denormalization step for performance and to allow public viewing.
            const authorDocRef = doc(db, 'users', userId);
            const authorDocSnap = await getDoc(authorDocRef);
            const isAuthorAvailable = authorDocSnap.data()?.availableForWork || false;

            const finalData = {
                ...projectData,
                domain: projectData.domain || 'creative', // Ensure domain is saved
                id: projectId,
                authorId: userId,
                image: coverUrl || projectData.image || '', // Prefer uploaded cover
                images: legacyImages.length > 0 ? legacyImages : (projectData.images || []), // Backward compatibility
                gallery: galleryObjects, // New rich data
                availableForWork: isAuthorAvailable, // Ensure this is saved
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
            updateProgress();

            // 6. Notificar a los Seguidores
            // TODO: [SCALABILITY] La lógica de notificación a seguidores ha sido eliminada del cliente.
            // Esto DEBE ser implementado como una Firebase Cloud Function que se active
            // con el evento `onCreate` en la colección 'projects'.
            // Hacerlo en el cliente no es escalable y fallará con usuarios populares.

            return projectId;
        } catch (error) {
            console.error("Error creating project:", error);
            // NOTE: If batch fails, we might have orphaned files in Storage.
            // In a production env, a Cloud Function should clean up orphaned files periodically.
            throw error;
        }
    },

    /**
     * Updates an existing project.
     * Handles uploading new files and merging with existing content.
     */
    updateProject: async (
        userId: string,
        projectId: string,
        projectData: Partial<PortfolioItem>,
        files: { cover?: File; gallery?: File[] },
        uploadOptions: {
            maxSizeMB: number;
            galleryMetadata?: { type: 'image' | 'video' | 'youtube'; caption?: string; fileIndex?: number; url?: string }[];
            onProgress?: (progress: number) => void;
        }
    ): Promise<void> => {
        try {
            // Initialize progress tracking
            const totalOps = (files.cover ? 1 : 0) + (files.gallery?.length || 0) + 1;
            let completedOps = 0;
            const updateProgress = () => {
                completedOps++;
                if (uploadOptions.onProgress) uploadOptions.onProgress(Math.round((completedOps / totalOps) * 100));
            };

            const projectRef = doc(db, 'projects', projectId);

            // 1. Upload Cover Image if provided
            let coverUrl = projectData.image; // Default to existing if not replaced
            if (files.cover) {
                const path = `users/${userId}/projects/${projectId}/cover_${Date.now()}.jpg`;
                coverUrl = await storageService.uploadImage(files.cover, path, uploadOptions);
                updateProgress();
            }

            // 2. Upload New Gallery Images
            const uploadedUrls: string[] = [];
            if (files.gallery && files.gallery.length > 0) {
                const uploadPromises = files.gallery.map(async (file, index) => {
                    const timestamp = Date.now();
                    const path = `users/${userId}/projects/${projectId}/gallery/${timestamp}_${index}.jpg`;
                    const url = await storageService.uploadImage(file, path, uploadOptions);
                    updateProgress();
                    return url;
                });
                uploadedUrls.push(...(await Promise.all(uploadPromises)));
            }

            // 3. Construct Gallery Objects (Merge existing URLs with new Uploads)
            let galleryObjects: any[] = [];
            if (uploadOptions.galleryMetadata) {
                galleryObjects = uploadOptions.galleryMetadata.map(meta => {
                    if (meta.type === 'image') {
                        // If fileIndex is present, it's a new upload
                        if (meta.fileIndex !== undefined) {
                            return { type: 'image', caption: meta.caption || '', url: uploadedUrls[meta.fileIndex] || '' };
                        }
                        // If url is present, it's an existing image
                        else if (meta.url) {
                            return { type: 'image', caption: meta.caption || '', url: meta.url };
                        }
                    } else if (meta.type === 'youtube') {
                        return { type: 'youtube', caption: meta.caption || '', url: meta.url || '' };
                    }
                    return null;
                }).filter(Boolean);
            }

            // Explicitly fetch and set the author's availability to ensure it's saved with the project.
            const authorDocRef = doc(db, 'users', userId);
            const authorDocSnap = await getDoc(authorDocRef);
            const isAuthorAvailable = authorDocSnap.data()?.availableForWork || false;

            const finalData = {
                ...projectData,
                image: coverUrl,
                availableForWork: isAuthorAvailable, // Ensure this is saved on update
                images: galleryObjects.filter(item => item.type === 'image').map(item => item.url), // Legacy support
                gallery: galleryObjects,
                updatedAt: new Date().toISOString()
            };

            // Remove undefined values
            Object.keys(finalData).forEach(key => (finalData as any)[key] === undefined && delete (finalData as any)[key]);

            await updateDoc(projectRef, finalData);
            updateProgress();
        } catch (error) {
            console.error("Error updating project:", error);
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
    getUserProjects: async (userId: string, limitCount?: number): Promise<PortfolioItem[]> => {
        try {
            // Strategy: Dual Query to support old (artistId) and new (authorId) items
            // We run both to ensure we catch legacy projects and newly created ones.
            const constraints: any[] = [orderBy('createdAt', 'desc')];
            if (limitCount) {
                constraints.push(limit(limitCount));
            }

            const queries = [
                // 1. Query by authorId (Standard)
                query(
                    collection(db, 'projects'),
                    where('authorId', '==', userId),
                    ...constraints
                ),
                // 2. Query by artistId (Legacy/Compatibility)
                query(
                    collection(db, 'projects'),
                    where('artistId', '==', userId),
                    ...constraints
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
                'stats.viewCount': increment(1),
                'views': increment(1)
            });
        } catch (error) {
            console.error("Error incrementing view:", error);
        }
    },

    toggleProjectLike: async (projectId: string, userId: string): Promise<boolean> => {
        try {
            const projectRef = doc(db, 'projects', projectId);
            const likeRef = doc(db, 'projects', projectId, 'likes', userId);
            const userRef = doc(db, 'users', userId);

            // Fetch necessary data upfront for atomic operations
            const [projectSnap, likeSnap, userSnap] = await Promise.all([
                getDoc(projectRef),
                getDoc(likeRef),
                getDoc(userRef)
            ]);

            const projectData = projectSnap.data();
            const userData = userSnap.data();
            const isLiked = likeSnap.exists();

            const batch = writeBatch(db);

            // Notification Reference (Deterministic ID)
            let notifRef = null;
            if (projectData && projectData.authorId) {
                notifRef = doc(db, 'users', projectData.authorId, 'notifications', `like_${projectId}_${userId}`);
            }

            if (isLiked) {
                // UNLIKE
                batch.delete(likeRef);
                batch.update(projectRef, {
                    'stats.likeCount': increment(-1),
                    'likes': increment(-1)
                });
                // Remove notification if it exists (Atomic cleanup)
                if (notifRef) {
                    batch.delete(notifRef);
                }

            } else {
                // LIKE
                batch.set(likeRef, {
                    userId,
                    createdAt: new Date().toISOString()
                });
                batch.update(projectRef, {
                    'stats.likeCount': increment(1),
                    'likes': increment(1)
                });

                // Create Notification (Atomic)
                // Only if not self-like
                if (projectData && projectData.authorId && projectData.authorId !== userId && notifRef) {
                    batch.set(notifRef, {
                        type: 'like',
                        user: userData?.name || 'Alguien',
                        avatar: userData?.avatar || '',
                        content: `le gustó tu proyecto "${projectData.title || 'Sin título'}"`,
                        image: projectData.image || '',
                        time: new Date().toISOString(),
                        read: false,
                        link: `/portfolio/${projectId}`
                    });
                }
            }

            await batch.commit();
            return !isLiked; // Return the new status
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
    ,

    // --- Comments ---

    addComment: async (projectId: string, commentData: { authorId: string; authorName: string; authorAvatar: string; text: string; }) => {
        const commentsCol = collection(db, 'projects', projectId, 'comments');
        const newCommentRef = doc(commentsCol);
        await setDoc(newCommentRef, {
            ...commentData,
            id: newCommentRef.id,
            createdAt: new Date().toISOString(),
            likes: 0,
            replies: []
        });
        // Also increment comment count on the project
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            'stats.commentCount': increment(1)
        });

        // Send Notification (async, fire and forget)
        (async () => {
            try {
                const projectSnap = await getDoc(projectRef);
                const projectData = projectSnap.data();

                if (projectData && projectData.authorId && projectData.authorId !== commentData.authorId) {
                    await addDoc(collection(db, 'users', projectData.authorId, 'notifications'), {
                        type: 'comment',
                        user: commentData.authorName,
                        avatar: commentData.authorAvatar,
                        content: `comentó en tu proyecto "${projectData.title || 'Sin título'}"`,
                        image: projectData.image || '', // Project cover
                        time: new Date().toISOString(),
                        read: false,
                        link: `/portfolio/${projectId}`
                    });
                }
            } catch (error) {
                console.error("Error creating comment notification:", error);
            }
        })();
    },

    listenToComments: (projectId: string, callback: (comments: any[]) => void) => {
        const commentsQuery = query(
            collection(db, 'projects', projectId, 'comments'),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(commentsQuery, (snapshot) => {
            const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(comments);
        });
    },

    deleteComment: async (projectId: string, commentId: string) => {
        const commentRef = doc(db, 'projects', projectId, 'comments', commentId);
        await deleteDoc(commentRef);
        // Also decrement comment count
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            'stats.commentCount': increment(-1)
        });
    },

    likeComment: async (projectId: string, commentId: string, userId: string) => {
        // Placeholder for like logic
        console.log(`Liking comment ${commentId} on project ${projectId} by user ${userId}`);
        // Actual logic would involve a subcollection on the comment document
    }
};
