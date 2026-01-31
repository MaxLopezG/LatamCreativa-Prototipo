/**
 * Servicio de Colecciones Local
 * Reemplaza Firebase Firestore para colecciones de usuario
 */
import { CollectionItem } from '../../types';

const COLLECTIONS_STORAGE_KEY = 'latamcreativa_collections';

const getStoredCollections = (userId: string): CollectionItem[] => {
    const key = `${COLLECTIONS_STORAGE_KEY}_${userId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
};

const saveCollections = (userId: string, collections: CollectionItem[]) => {
    const key = `${COLLECTIONS_STORAGE_KEY}_${userId}`;
    localStorage.setItem(key, JSON.stringify(collections));
};

export const localCollectionsService = {
    /**
     * Obtener colecciones de un usuario
     */
    getUserCollections: async (userId: string): Promise<CollectionItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return getStoredCollections(userId);
    },

    /**
     * Crear nueva colección
     */
    createCollection: async (
        userId: string,
        title: string,
        isPrivate: boolean = false
    ): Promise<CollectionItem> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const collections = getStoredCollections(userId);

        const newCollection: CollectionItem = {
            id: `collection-${Date.now()}`,
            title,
            isPrivate,
            itemCount: 0,
            thumbnails: [],
            items: [],
            createdAt: new Date().toISOString()
        };

        collections.push(newCollection);
        saveCollections(userId, collections);

        return newCollection;
    },

    /**
     * Agregar item a colección
     */
    addToCollection: async (
        userId: string,
        collectionId: string,
        item: { id: string; type: string; image: string }
    ): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const collections = getStoredCollections(userId);
        const index = collections.findIndex(c => c.id === collectionId);

        if (index !== -1) {
            const collection = collections[index];

            // Verificar si ya existe
            const existingItems = collection.items || [];
            if (!existingItems.find(i => i.id === item.id)) {
                existingItems.push({
                    id: item.id,
                    type: item.type as 'project' | 'article',
                    addedAt: new Date().toISOString()
                });

                collection.items = existingItems;
                collection.itemCount = existingItems.length;
                collection.thumbnails = [item.image, ...(collection.thumbnails || [])].slice(0, 4);

                collections[index] = collection;
                saveCollections(userId, collections);
            }
        }
    },

    /**
     * Remover item de colección
     */
    removeFromCollection: async (
        userId: string,
        collectionId: string,
        itemId: string
    ): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const collections = getStoredCollections(userId);
        const index = collections.findIndex(c => c.id === collectionId);

        if (index !== -1) {
            const collection = collections[index];
            const items = collection.items || [];
            collection.items = items.filter(i => i.id !== itemId);
            collection.itemCount = collection.items.length;

            collections[index] = collection;
            saveCollections(userId, collections);
        }
    },

    /**
     * Eliminar colección
     */
    deleteCollection: async (userId: string, collectionId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const collections = getStoredCollections(userId);
        saveCollections(userId, collections.filter(c => c.id !== collectionId));
    },

    /**
     * Actualizar colección
     */
    updateCollection: async (
        userId: string,
        collectionId: string,
        updates: Partial<CollectionItem>
    ): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const collections = getStoredCollections(userId);
        const index = collections.findIndex(c => c.id === collectionId);

        if (index !== -1) {
            collections[index] = { ...collections[index], ...updates };
            saveCollections(userId, collections);
        }
    }
};
