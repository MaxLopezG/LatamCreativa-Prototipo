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
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { storageService } from './storage';
import { PortfolioItem } from '../../types';

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
        files: { cover?: File; gallery?: File[] }
    ): Promise<string> => {
        try {
            // 1. Generate ID first to create storage paths
            const newProjectRef = doc(collection(db, 'projects'));
            const projectId = newProjectRef.id;

            // 2. Upload Cover Image
            let coverUrl = '';
            if (files.cover) {
                const path = `users/${userId}/projects/${projectId}/cover.jpg`;
                coverUrl = await storageService.uploadImage(files.cover, path);
            }

            // 3. Upload Gallery Images
            const galleryUrls: string[] = [];
            if (files.gallery && files.gallery.length > 0) {
                const uploadPromises = files.gallery.map(async (file, index) => {
                    // Unique names for gallery items
                    const timestamp = Date.now();
                    const path = `users/${userId}/projects/${projectId}/gallery/${timestamp}_${index}.jpg`;
                    return await storageService.uploadImage(file, path);
                });
                const urls = await Promise.all(uploadPromises);
                galleryUrls.push(...urls);
            }

            // 4. Prepare Final Data
            const finalData = {
                ...projectData,
                id: projectId,
                authorId: userId,
                image: coverUrl || projectData.image || '', // Prefer uploaded cover
                images: galleryUrls.length > 0 ? galleryUrls : (projectData.images || []),
                createdAt: new Date().toISOString(), // Store as string for easy serialization
                views: '0',
                likes: '0',
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

            // TODO: Trigger a Cloud Function to recursively delete 'users/{userId}/projects/{projectId}' folder in Storage
            // Deleting storage files client-side is risky and slow for the user.
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    },

    /**
     * Fetch all projects for a specific user
     */
    getUserProjects: async (userId: string): Promise<PortfolioItem[]> => {
        try {
            const q = query(
                collection(db, 'projects'),
                where('authorId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
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
    }
};
