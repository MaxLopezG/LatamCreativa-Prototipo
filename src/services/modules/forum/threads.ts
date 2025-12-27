/**
 * Forum Threads CRUD Operations
 * 
 * Módulo que maneja las operaciones Create, Read, Update, Delete
 * para hilos del foro almacenados en Firestore.
 * 
 * @module services/forum/threads
 */
import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    where,
    increment,
    QueryDocumentSnapshot,
    DocumentData,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ForumThread, ForumPaginatedResult } from '../../../types/forum';
import { storageService } from '../storage';
import { notificationsService } from '../notifications';
import { sanitizeData } from '../utils';
import { generateUniqueSlug } from '../../../utils/slugUtils';

const COLLECTION_NAME = 'forumThreads';

/**
 * Calcula el tiempo transcurrido desde una fecha
 */
function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    if (diffWeeks < 4) return `hace ${diffWeeks}sem`;
    return `hace ${diffMonths}mes`;
}

/**
 * Genera un extracto del contenido (limpia HTML y Markdown)
 */
function generateExcerpt(content: string, maxLength = 150): string {
    // Remove HTML tags (from WYSIWYG editor)
    let plainText = content
        .replace(/<[^>]*>/g, ' ')         // Remove all HTML tags
        .replace(/&nbsp;/g, ' ')          // Replace &nbsp; with space
        .replace(/&amp;/g, '&')           // Decode &amp;
        .replace(/&lt;/g, '<')            // Decode &lt;
        .replace(/&gt;/g, '>')            // Decode &gt;
        .replace(/&quot;/g, '"')          // Decode quotes
        // Also clean markdown formatting
        .replace(/```[\s\S]*?```/g, '')   // Remove code blocks
        .replace(/`[^`]*`/g, '')          // Remove inline code
        .replace(/[#*_~\[\]]/g, '')       // Remove markdown symbols
        .replace(/!\[.*?\]\(.*?\)/g, '')  // Remove markdown images
        .replace(/\[.*?\]\(.*?\)/g, '')   // Remove markdown links
        .replace(/\s+/g, ' ')             // Normalize whitespace
        .trim();

    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
}

export const forumThreadsCrud = {
    /**
     * Obtiene hilos paginados con filtros opcionales.
     */
    async getThreads(
        options: {
            category?: string;
            sortBy?: 'recent' | 'popular' | 'activity' | 'unanswered';
            lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
            pageSize?: number;
        } = {}
    ): Promise<ForumPaginatedResult<ForumThread>> {
        const {
            category,
            sortBy = 'activity',
            lastDoc = null,
            pageSize = 20
        } = options;

        try {
            const threadsRef = collection(db, COLLECTION_NAME);
            const constraints: Parameters<typeof query>[1][] = [];

            // Filter by category
            if (category && category !== 'all') {
                constraints.push(where('category', '==', category));
            }

            // Filter unanswered
            if (sortBy === 'unanswered') {
                constraints.push(where('isResolved', '==', false));
                constraints.push(orderBy('createdAt', 'desc'));
            } else {
                // Add sort order
                switch (sortBy) {
                    case 'recent':
                        constraints.push(orderBy('createdAt', 'desc'));
                        break;
                    case 'popular':
                        constraints.push(orderBy('likes', 'desc'));
                        break;
                    case 'activity':
                    default:
                        constraints.push(orderBy('lastActivityAt', 'desc'));
                        break;
                }
            }

            // Pagination
            constraints.push(limit(pageSize + 1)); // +1 to check if there are more
            if (lastDoc) {
                constraints.push(startAfter(lastDoc));
            }

            const q = query(threadsRef, ...constraints);
            const snapshot = await getDocs(q);

            const threads: ForumThread[] = [];
            let hasMore = false;
            let newLastDoc: QueryDocumentSnapshot<DocumentData> | null = null;

            snapshot.docs.forEach((docSnap, index) => {
                if (index < pageSize) {
                    const data = docSnap.data();
                    threads.push({
                        id: docSnap.id,
                        ...data,
                        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
                        lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt
                    } as ForumThread);
                    newLastDoc = docSnap;
                } else {
                    hasMore = true;
                }
            });

            // Sort pinned threads to top
            threads.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return 0;
            });

            return { items: threads, hasMore, lastDoc: newLastDoc };
        } catch (error) {
            console.error('Error fetching threads:', error);
            return { items: [], hasMore: false, lastDoc: null };
        }
    },

    /**
     * Obtiene un hilo por su ID.
     */
    async getThread(threadId: string): Promise<ForumThread | null> {
        try {
            const docRef = doc(db, COLLECTION_NAME, threadId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) return null;

            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
                lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt
            } as ForumThread;
        } catch (error) {
            console.error('Error fetching thread:', error);
            return null;
        }
    },

    /**
     * Obtiene un hilo por su slug (para URLs SEO-friendly).
     * Si no encuentra por slug, intenta buscar por ID.
     */
    async getThreadBySlug(slugOrId: string): Promise<ForumThread | null> {
        try {
            // First try to find by slug
            const threadsRef = collection(db, COLLECTION_NAME);
            const q = query(threadsRef, where('slug', '==', slugOrId), limit(1));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const docSnap = snapshot.docs[0];
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
                    lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt
                } as ForumThread;
            }

            // Fallback: try by ID (backward compatibility)
            return await this.getThread(slugOrId);
        } catch (error) {
            console.error('Error fetching thread by slug:', error);
            return null;
        }
    },

    /**
     * Crea un nuevo hilo.
     */
    async createThread(
        threadData: {
            title: string;
            content: string;
            category: string;
            tags?: string[];
            authorId: string;
            authorName: string;
            authorUsername?: string;
            authorAvatar?: string;
            authorRole?: string;
        },
        attachmentFiles?: File[]
    ): Promise<{ id: string; slug: string }> {
        try {
            const threadsRef = collection(db, COLLECTION_NAME);
            const newDocRef = doc(threadsRef);
            const now = new Date().toISOString();

            // Generate unique slug
            const slug = await generateUniqueSlug(
                threadData.title,
                async (testSlug) => {
                    const q = query(threadsRef, where('slug', '==', testSlug), limit(1));
                    const snapshot = await getDocs(q);
                    return snapshot.empty;
                }
            );

            // Upload attachments if any
            let attachments: { id: string; url: string; type: 'image' | 'file'; name: string; size: number }[] = [];
            if (attachmentFiles && attachmentFiles.length > 0) {
                attachments = await Promise.all(
                    attachmentFiles.map(async (file, index) => {
                        const url = await storageService.uploadImage(
                            file,
                            `forum/${newDocRef.id}/attachments/${index}_${file.name}`
                        );
                        return {
                            id: `${newDocRef.id}_${index}`,
                            url,
                            type: file.type.startsWith('image/') ? 'image' as const : 'file' as const,
                            name: file.name,
                            size: file.size
                        };
                    })
                );
            }

            const thread: Omit<ForumThread, 'id'> = {
                slug,
                title: threadData.title.trim(),
                content: threadData.content,
                excerpt: generateExcerpt(threadData.content),
                authorId: threadData.authorId,
                authorName: threadData.authorName,
                authorUsername: threadData.authorUsername,
                authorAvatar: threadData.authorAvatar,
                authorRole: threadData.authorRole,
                category: threadData.category,
                tags: threadData.tags || [],
                views: 0,
                replies: 0,
                likes: 0,
                isPinned: false,
                isClosed: false,
                isResolved: false,
                createdAt: now,
                lastActivityAt: now,
                attachments: attachments.length > 0 ? attachments : undefined
            };

            await setDoc(newDocRef, sanitizeData(thread));

            return { id: newDocRef.id, slug };
        } catch (error) {
            console.error('Error creating thread:', error);
            throw error;
        }
    },

    /**
     * Actualiza un hilo existente.
     */
    async updateThread(
        threadId: string,
        data: Partial<Pick<ForumThread, 'title' | 'content' | 'category' | 'tags'>>
    ): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, threadId);

            const updateData: Record<string, unknown> = {
                ...data,
                updatedAt: new Date().toISOString()
            };

            // Update excerpt if content changed
            if (data.content) {
                updateData.excerpt = generateExcerpt(data.content);
            }

            await updateDoc(docRef, sanitizeData(updateData));
        } catch (error) {
            console.error('Error updating thread:', error);
            throw error;
        }
    },

    /**
     * Elimina un hilo y sus respuestas/likes asociados.
     */
    async deleteThread(threadId: string): Promise<void> {
        try {
            // Get thread to check for attachments
            const thread = await this.getThread(threadId);

            // Delete attachments from storage
            if (thread?.attachments) {
                await Promise.all(
                    thread.attachments.map(att =>
                        storageService.deleteImage(att.url).catch(console.error)
                    )
                );
            }

            // Delete the thread document
            // Note: Subcollections (replies, likes) will be orphaned but can be cleaned up by a Cloud Function
            const docRef = doc(db, COLLECTION_NAME, threadId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting thread:', error);
            throw error;
        }
    },

    /**
     * Obtiene los hilos de un usuario específico.
     */
    async getUserThreads(userId: string, limitCount = 10): Promise<ForumThread[]> {
        try {
            const threadsRef = collection(db, COLLECTION_NAME);
            const q = query(
                threadsRef,
                where('authorId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                    lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt
                } as ForumThread;
            });
        } catch (error) {
            console.error('Error fetching user threads:', error);
            return [];
        }
    },

    /**
     * Incrementa el contador de vistas de un hilo.
     */
    async incrementViews(threadId: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTION_NAME, threadId);
            await updateDoc(docRef, { views: increment(1) });
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    },

    /**
     * Alterna el like de un hilo.
     */
    async toggleLike(threadId: string, userId: string): Promise<boolean> {
        try {
            const likeRef = doc(db, COLLECTION_NAME, threadId, 'likes', userId);
            const likeSnap = await getDoc(likeRef);

            const threadRef = doc(db, COLLECTION_NAME, threadId);

            if (likeSnap.exists()) {
                // Remove like
                await deleteDoc(likeRef);
                await updateDoc(threadRef, { likes: increment(-1) });
                return false;
            } else {
                // Add like
                await setDoc(likeRef, {
                    createdAt: new Date().toISOString(),
                    userId
                });
                await updateDoc(threadRef, { likes: increment(1) });
                return true;
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    },

    /**
     * Verifica si un usuario ha dado like a un hilo.
     */
    async getLikeStatus(threadId: string, userId: string): Promise<boolean> {
        try {
            const likeRef = doc(db, COLLECTION_NAME, threadId, 'likes', userId);
            const likeSnap = await getDoc(likeRef);
            return likeSnap.exists();
        } catch (error) {
            console.error('Error checking like status:', error);
            return false;
        }
    },

    /**
     * Obtiene los hilos más recientes.
     */
    async getRecentThreads(limitCount = 5): Promise<ForumThread[]> {
        try {
            const threadsRef = collection(db, COLLECTION_NAME);
            const q = query(
                threadsRef,
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                    lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt
                } as ForumThread;
            });
        } catch (error) {
            console.error('Error fetching recent threads:', error);
            return [];
        }
    },

    /**
     * Busca hilos por texto en título o contenido.
     */
    async searchThreads(searchQuery: string, limitCount = 20): Promise<ForumThread[]> {
        try {
            // Note: Firestore doesn't support full-text search natively
            // This is a simple prefix search on title. For better search,
            // consider using Algolia or Elasticsearch.
            const threadsRef = collection(db, COLLECTION_NAME);
            const q = query(
                threadsRef,
                orderBy('title'),
                where('title', '>=', searchQuery),
                where('title', '<=', searchQuery + '\uf8ff'),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                    lastActivityAt: data.lastActivityAt?.toDate?.()?.toISOString() || data.lastActivityAt
                } as ForumThread;
            });
        } catch (error) {
            console.error('Error searching threads:', error);
            return [];
        }
    }
};
