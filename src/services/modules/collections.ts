
import { db } from '../../lib/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { CollectionItem, SavedItemReference } from '../../types';

export const collectionsService = {
    // Get all collections for a specific user (owner only - used for own profile)
    getUserCollections: async (userId: string): Promise<CollectionItem[]> => {
        try {
            const q = query(collection(db, `users/${userId}/collections`), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CollectionItem[];
        } catch (error) {
            console.error("Error fetching collections:", error);
            return [];
        }
    },

    // Get only public collections for a user (used for viewing other users' profiles)
    getPublicUserCollections: async (userId: string): Promise<CollectionItem[]> => {
        try {
            const q = query(
                collection(db, `users/${userId}/collections`),
                where('isPrivate', '==', false),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CollectionItem[];
        } catch (error) {
            console.error("Error fetching public collections:", error);
            return [];
        }
    },

    // Get a single collection by owner ID and collection ID
    getCollectionById: async (userId: string, collectionId: string): Promise<CollectionItem | null> => {
        try {
            const colRef = doc(db, `users/${userId}/collections`, collectionId);
            const snapshot = await getDoc(colRef);

            if (snapshot.exists()) {
                return {
                    id: snapshot.id,
                    ...snapshot.data()
                } as CollectionItem;
            }
            return null;
        } catch (error) {
            console.error("Error fetching collection:", error);
            return null;
        }
    },

    // Create a new collection
    createCollection: async (userId: string, title: string, isPrivate: boolean): Promise<CollectionItem | null> => {
        try {
            const newCollectionData = {
                title,
                isPrivate,
                itemCount: 0,
                thumbnails: [],
                items: [], // Array of item IDs
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, `users/${userId}/collections`), newCollectionData);

            return {
                id: docRef.id,
                ...newCollectionData
            } as CollectionItem;
        } catch (error) {
            console.error("Error creating collection:", error);
            return null;
        }
    },

    // Update collection metadata (title, privacy)
    updateCollection: async (userId: string, collectionId: string, updates: { title?: string; isPrivate?: boolean }): Promise<void> => {
        try {
            const colRef = doc(db, `users/${userId}/collections`, collectionId);
            await updateDoc(colRef, updates);
        } catch (error) {
            console.error("Error updating collection:", error);
            throw error;
        }
    },

    // Add an item to a collection
    addToCollection: async (userId: string, collectionId: string, item: { id: string, image: string, type: 'project' | 'article' }): Promise<void> => {
        try {
            const colRef = doc(db, `users/${userId}/collections`, collectionId);
            const snapshot = await getDoc(colRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                const currentItems = (data.items || []) as SavedItemReference[];

                // Check for duplicates based on ID
                if (!currentItems.some(i => i.id === item.id)) {
                    const newItem = {
                        id: item.id,
                        type: item.type,
                        addedAt: new Date().toISOString()
                    };
                    const newItems = [...currentItems, newItem];
                    const newThumbs = [item.image, ...(data.thumbnails || [])].slice(0, 4);

                    await updateDoc(colRef, {
                        items: newItems,
                        thumbnails: newThumbs,
                        itemCount: newItems.length
                    });
                }
            }
        } catch (error) {
            console.error("Error adding to collection:", error);
            throw error;
        }
    },

    // Remove item from collection
    removeFromCollection: async (userId: string, collectionId: string, itemId: string): Promise<void> => {
        try {
            const colRef = doc(db, `users/${userId}/collections`, collectionId);
            const snapshot = await getDoc(colRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                const currentItems = (data.items || []) as SavedItemReference[];

                // Filter out the item
                const newItems = currentItems.filter(i => i.id !== itemId);

                if (newItems.length !== currentItems.length) {
                    await updateDoc(colRef, {
                        items: newItems,
                        itemCount: newItems.length
                        // We strictly can't easily remove the specific thumbnail without tracking which one it is
                        // For now we keep thumbnails as is, they are just a preview cache.
                    });
                }
            }
        } catch (error) {
            console.error("Error removing from collection:", error);
            throw error;
        }
    },

    // Delete a collection
    deleteCollection: async (userId: string, collectionId: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, `users/${userId}/collections`, collectionId));
        } catch (error) {
            console.error("Error deleting collection:", error);
            throw error;
        }
    }
};
