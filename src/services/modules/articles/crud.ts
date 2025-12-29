/**
 * Operaciones CRUD de Artículos
 * 
 * Módulo que maneja las operaciones Create, Read, Update, Delete
 * para artículos del blog almacenados en Firestore.
 * 
 * @module services/articles/crud
 */
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
    getDoc,
    updateDoc,
    where,
    increment,
    QueryDocumentSnapshot,
    DocumentData,
    documentId
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ArticleItem, Notification } from '../../../types';
import { PaginatedResult, withTimeout, sanitizeData } from '../utils';
import { usersService } from '../users';
import { notificationsService } from '../notifications';
import { storageService } from '../storage';
import { generateUniqueSlug } from '../../../utils/slugUtils';

export const articlesCrud = {
    /**
     * Obtiene artículos paginados.
     * 
     * @param lastDoc - Último documento de la página anterior (null para primera página)
     * @param pageSize - Cantidad de artículos por página
     * @param sortField - Campo para ordenar ('date' o 'likes')
     * @param sortDirection - Dirección del ordenamiento
     * @returns Resultado paginado con datos, cursor y flag hasMore
     */
    getArticles: async (lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize = 10, sortField: 'date' | 'likes' = 'date', sortDirection: 'desc' | 'asc' = 'desc'): Promise<PaginatedResult<ArticleItem>> => {
        try {
            // Only fetch published articles for public listings
            let q = query(
                collection(db, 'articles'),
                where('status', '==', 'published'),
                orderBy(sortField, sortDirection),
                limit(pageSize)
            );

            if (lastDoc) {
                q = query(
                    collection(db, 'articles'),
                    where('status', '==', 'published'),
                    orderBy(sortField, sortDirection),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === pageSize
            };
        } catch (error) {
            console.error("Error fetching articles:", error);
            throw error;
        }
    },

    /**
     * Crea un nuevo artículo.
     * 
     * Sube la imagen de portada (si existe) y notifica a los seguidores del autor.
     * 
     * @param articleData - Datos del artículo
     * @param imageFile - Archivo de imagen de portada (opcional)
     * @returns ID del artículo creado
     */
    createArticle: async (articleData: Omit<ArticleItem, 'id'>, imageFile?: File): Promise<{ id: string; slug: string }> => {
        try {
            let imageUrl = articleData.image;

            if (imageFile) {
                try {
                    const imagePath = `articles/${Date.now()}_${imageFile.name}`;
                    imageUrl = await withTimeout(
                        storageService.uploadImage(imageFile, imagePath, { maxSizeMB: 5, compress: true }),
                        15000,
                        "Image upload timed out (15s). Please check your connection."
                    );
                } catch (uploadError: any) {
                    console.error("Error uploading image:", uploadError);
                }
            }

            const finalData = sanitizeData({
                ...articleData,
                slug: generateUniqueSlug(articleData.title || 'articulo'),
                image: imageUrl,
                date: new Date().toISOString(),
                likes: 0,
                comments: 0,
                views: 0,
                status: articleData.status || 'published',
                scheduledAt: articleData.scheduledAt || null
            });

            const docRef = await withTimeout(
                addDoc(collection(db, 'articles'), finalData),
                7000,
                "Saving article timed out (7s). Please check your connection."
            );

            // Notify Followers
            try {
                if (articleData.authorId) {
                    const followers = await usersService.getFollowers(articleData.authorId);

                    const notification: Omit<Notification, 'id'> = {
                        type: 'system',
                        user: articleData.author,
                        avatar: articleData.authorAvatar,
                        content: `publicó un nuevo artículo: "${articleData.title}"`,
                        category: articleData.category,
                        link: `/blog/${docRef.id}`,
                        time: new Date().toISOString(),
                        read: false
                    };

                    await Promise.all(followers.map(followerId =>
                        notificationsService.createNotification(followerId, notification)
                    ));
                }
            } catch (notifError) {
                console.error("Error sending notifications:", notifError);
            }

            return { id: docRef.id, slug: finalData.slug as string };
        } catch (error) {
            console.error("Error creating article:", error);
            throw error;
        }
    },

    /**
     * Actualiza un artículo existente.
     * 
     * @param articleId - ID del artículo
     * @param articleData - Datos a actualizar
     * @param imageFile - Nueva imagen de portada (opcional)
     */
    updateArticle: async (articleId: string, articleData: Partial<ArticleItem>, imageFile?: File): Promise<void> => {
        try {
            let imageUrl = articleData.image;

            if (imageFile) {
                try {
                    const imagePath = `articles/${Date.now()}_${imageFile.name}`;
                    imageUrl = await storageService.uploadImage(imageFile, imagePath, { maxSizeMB: 5, compress: true });
                } catch (uploadError: any) {
                    console.error("Error uploading new image:", uploadError);
                }
            }

            const docRef = doc(db, 'articles', articleId);
            const finalData = sanitizeData({ ...articleData, image: imageUrl });

            await updateDoc(docRef, finalData);
        } catch (error) {
            console.error("Error updating article:", error);
            throw error;
        }
    },

    /**
     * Obtiene los artículos más recientes.
     * 
     * @param limitCount - Cantidad máxima (default: 4)
     * @returns Array de artículos
     */
    getRecentArticles: async (limitCount = 4): Promise<ArticleItem[]> => {
        try {
            // Only fetch published articles
            const q = query(
                collection(db, 'articles'),
                where('status', '==', 'published'),
                orderBy('date', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));
        } catch (error) {
            console.error("Error fetching recent articles:", error);
            return [];
        }
    },

    /**
     * Obtiene artículos de un usuario (soporta nombre e ID).
     * 
     * Realiza queries duales para compatibilidad con datos legacy.
     * 
     * @param authorName - Nombre del autor
     * @param authorId - ID del autor (opcional pero recomendado)
     * @returns Array de artículos ordenados por fecha
     */
    getUserArticles: async (authorName: string, authorId?: string): Promise<ArticleItem[]> => {
        try {
            const queries = [];

            if (authorName) {
                queries.push(query(collection(db, 'articles'), where('author', '==', authorName), orderBy('date', 'desc')));
            }

            if (authorId) {
                queries.push(query(collection(db, 'articles'), where('authorId', '==', authorId), orderBy('date', 'desc')));
            }

            if (queries.length === 0) return [];

            const snapshots = await Promise.all(queries.map(q => getDocs(q)));

            const articlesMap = new Map<string, ArticleItem>();
            snapshots.forEach(snap => {
                snap.forEach(doc => {
                    articlesMap.set(doc.id, { id: doc.id, ...doc.data() as object } as ArticleItem);
                });
            });

            return Array.from(articlesMap.values()).sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } catch (error) {
            console.error("Error fetching user articles:", error);
            throw error;
        }
    },

    /**
     * Obtiene artículos por categorías.
     * 
     * Soporta hasta 10 categorías (límite de Firestore 'in').
     * 
     * @param categories - Array de categorías
     * @param lastDoc - Cursor de paginación
     * @param limitCount - Cantidad por página
     * @returns Resultado paginado
     */
    getArticlesByCategories: async (categories: string[], lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, limitCount = 10): Promise<PaginatedResult<ArticleItem>> => {
        try {
            if (!categories || categories.length === 0) return { data: [], lastDoc: null, hasMore: false };

            const limitedCategories = categories.slice(0, 10);

            // Only fetch published articles
            let q = query(
                collection(db, 'articles'),
                where('status', '==', 'published'),
                where('category', 'in', limitedCategories),
                orderBy('date', 'desc'),
                limit(limitCount)
            );

            if (lastDoc) {
                q = query(
                    collection(db, 'articles'),
                    where('status', '==', 'published'),
                    where('category', 'in', limitedCategories),
                    orderBy('date', 'desc'),
                    startAfter(lastDoc),
                    limit(limitCount)
                );
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === limitCount
            };
        } catch (error) {
            console.error("Error fetching articles by categories:", error);
            return { data: [], lastDoc: null, hasMore: false };
        }
    },

    /**
     * Obtiene artículos por tag.
     * 
     * @param tag - Tag a buscar
     * @param lastDoc - Cursor de paginación
     * @param limitCount - Cantidad por página
     * @returns Resultado paginado
     */
    getArticlesByTag: async (tag: string, lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, limitCount = 10): Promise<PaginatedResult<ArticleItem>> => {
        try {
            // Only fetch published articles
            let q = query(
                collection(db, 'articles'),
                where('status', '==', 'published'),
                where('tags', 'array-contains', tag),
                orderBy('date', 'desc'),
                limit(limitCount)
            );

            if (lastDoc) {
                q = query(
                    collection(db, 'articles'),
                    where('status', '==', 'published'),
                    where('tags', 'array-contains', tag),
                    orderBy('date', 'desc'),
                    startAfter(lastDoc),
                    limit(limitCount)
                );
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === limitCount
            };
        } catch (error) {
            console.error("Error fetching articles by tag:", error);
            return { data: [], lastDoc: null, hasMore: false };
        }
    },

    /**
     * Obtiene múltiples artículos por sus IDs.
     * 
     * Maneja el límite de 10 items de Firestore dividiendo en chunks.
     * 
     * @param ids - Array de IDs
     * @returns Array de artículos encontrados
     */
    getArticlesByIds: async (ids: string[]): Promise<ArticleItem[]> => {
        if (!ids || ids.length === 0) return [];

        const chunks = [];
        for (let i = 0; i < ids.length; i += 10) {
            chunks.push(ids.slice(i, i + 10));
        }

        try {
            const results = await Promise.all(chunks.map(async chunk => {
                const q = query(collection(db, 'articles'), where(documentId(), 'in', chunk));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleItem));
            }));

            return results.flat();
        } catch (error) {
            console.error("Error fetching articles by IDs:", error);
            return [];
        }
    },

    /**
     * Obtiene un artículo por su ID.
     * 
     * @param articleId - ID del artículo
     * @returns El artículo o null si no existe
     */
    getArticle: async (articleId: string): Promise<ArticleItem | null> => {
        try {
            const docRef = doc(db, 'articles', articleId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as ArticleItem;
            }
            return null;
        } catch (error) {
            console.error("Error fetching article:", error);
            throw error;
        }
    },

    /**
     * Obtiene un artículo por su slug (URL amigable).
     * Si no encuentra por slug, intenta buscar por ID (backward compatibility).
     * 
     * @param slugOrId - Slug del artículo o ID de Firebase
     * @returns El artículo encontrado o null si no existe
     */
    getArticleBySlug: async (slugOrId: string): Promise<ArticleItem | null> => {
        try {
            // First try to find by slug
            const slugQuery = query(collection(db, 'articles'), where('slug', '==', slugOrId), limit(1));
            const slugSnapshot = await getDocs(slugQuery);

            if (!slugSnapshot.empty) {
                const docData = slugSnapshot.docs[0];
                return { id: docData.id, ...docData.data() } as ArticleItem;
            }

            // Fallback: try to find by ID (for old articles without slug)
            const docRef = doc(db, 'articles', slugOrId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as ArticleItem;
            }

            return null;
        } catch (error) {
            console.error("Error fetching article by slug:", error);
            return null;
        }
    },

    /**
     * Elimina un artículo y su imagen asociada del Storage.
     * 
     * @param articleId - ID del artículo a eliminar
     */
    deleteArticle: async (articleId: string): Promise<void> => {
        try {
            // Get article data to find the image URL
            const docRef = doc(db, 'articles', articleId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const articleData = docSnap.data();

                // Delete image from Storage if it exists and is from our storage
                if (articleData.image && articleData.image.includes('firebasestorage.googleapis.com')) {
                    try {
                        await storageService.deleteFromUrl(articleData.image);
                    } catch (storageError) {
                        console.warn("Could not delete article image:", storageError);
                    }
                }
            }

            // Delete the article document
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting article:", error);
            throw error;
        }
    },

    /**
     * Incrementa el contador de vistas de un artículo.
     * 
     * @param articleId - ID del artículo
     */
    incrementArticleViews: async (articleId: string): Promise<void> => {
        try {
            const articleRef = doc(db, 'articles', articleId);
            await updateDoc(articleRef, { views: increment(1) });
        } catch (error) {
            console.error("Error incrementing article views:", error);
        }
    }
};
