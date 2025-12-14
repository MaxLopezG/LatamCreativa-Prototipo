import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    QueryDocumentSnapshot,
    DocumentData,
    where,
    documentId,
    getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { PortfolioItem } from '../../types';
import { PaginatedResult } from './utils';


const getProjects = async (lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize = 10): Promise<PaginatedResult<PortfolioItem>> => {
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
        console.error("Error fetching projects:", error);
        throw error;
    }
};

export const projectsService = {
    getProjects,

    getFeed: getProjects,

    // Updated: Accept artistId implicitly in projectData (Omit<PortfolioItem, 'id'>)
    createProject: async (projectData: Omit<PortfolioItem, 'id'>, imageFile?: File): Promise<string> => {
        try {
            let imageUrl = projectData.image;

            // 1. Upload Image if provided
            if (imageFile) {
                const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
                const uploadResult = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            // 2. Save Document with artistId if present
            const docRef = await addDoc(collection(db, 'projects'), {
                ...projectData,
                image: imageUrl,
                createdAt: new Date().toISOString(),
                likes: 0,
                views: 0
            });

            return docRef.id;
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    },

    deleteProject: async (id: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, 'projects', id));
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    },

    getUserProjects: async (userId: string, userName: string): Promise<PortfolioItem[]> => {
        try {
            // Strategy: Dual Query to support old (Name-only) and new (ID-based) items
            // 1. Query by artistId (New Robust Method)
            const qId = query(
                collection(db, 'projects'),
                where('artistId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            // 2. Query by artist name (Legacy Method - prone to changes)
            const qName = query(
                collection(db, 'projects'),
                where('artist', '==', userName),
                orderBy('createdAt', 'desc')
            );

            const [snapId, snapName] = await Promise.all([
                getDocs(qId),
                getDocs(qName)
            ]);

            // Merge and Deduplicate
            const projectsMap = new Map<string, PortfolioItem>();

            snapId.forEach(doc => {
                projectsMap.set(doc.id, { id: doc.id, ...doc.data() } as PortfolioItem);
            });

            snapName.forEach(doc => {
                if (!projectsMap.has(doc.id)) {
                    projectsMap.set(doc.id, { id: doc.id, ...doc.data() } as PortfolioItem);
                }
            });

            // Convert back to array and sort
            return Array.from(projectsMap.values()).sort((a, b) => {
                // Assuming createdAt exists and is ISO string
                const dateA = (a as any).createdAt || '';
                const dateB = (b as any).createdAt || '';
                return dateB.localeCompare(dateA);
            });

        } catch (error) {
            console.error("Error fetching user projects:", error);
            return []; // Fail gracefully
        }
    },

    getProjectsByIds: async (ids: string[]): Promise<PortfolioItem[]> => {
        if (!ids || ids.length === 0) return [];
        try {
            // Firestore 'in' query limit is 10. Split into chunks.
            const chunks = [];
            for (let i = 0; i < ids.length; i += 10) {
                chunks.push(ids.slice(i, i + 10));
            }

            const results: PortfolioItem[] = [];
            for (const chunk of chunks) {
                const q = query(
                    collection(db, 'projects'),
                    where(documentId(), 'in', chunk)
                );
                const snapshot = await getDocs(q);
                console.log(`[getProjectsByIds] Chunk results for ${chunk}:`, snapshot.docs.map(d => d.id));
                snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() } as PortfolioItem));
            }
            return results;
        } catch (error) {
            console.error("Error fetching projects by IDs:", error);
            return [];
        }
    },

    getProject: async (id: string): Promise<PortfolioItem | null> => {
        try {
            const docRef = doc(db, 'projects', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as PortfolioItem;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching project:", error);
            throw error;
        }
    }
};
