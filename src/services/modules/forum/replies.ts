/**
 * Forum Replies Management
 * 
 * Módulo que maneja las respuestas a los hilos del foro,
 * incluyendo CRUD, likes y marcado de mejor respuesta.
 * 
 * @module services/forum/replies
 */
import {
    collection,
    query,
    orderBy,
    getDocs,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    increment,
    limit,
    addDoc
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ForumReply } from '../../../types/forum';
import { sanitizeData } from '../utils';
import { notificationsService } from '../notifications';

const THREADS_COLLECTION = 'forumThreads';

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

    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays < 7) return `hace ${diffDays}d`;
    if (diffWeeks < 4) return `hace ${diffWeeks}sem`;
    return `hace ${Math.floor(diffDays / 30)}mes`;
}

export const forumReplies = {
    /**
     * Obtiene todas las respuestas de un hilo.
     */
    async getReplies(
        threadId: string,
        sortBy: 'oldest' | 'newest' | 'likes' = 'oldest'
    ): Promise<ForumReply[]> {
        try {
            const repliesRef = collection(db, THREADS_COLLECTION, threadId, 'replies');

            let q;
            switch (sortBy) {
                case 'newest':
                    q = query(repliesRef, orderBy('createdAt', 'desc'));
                    break;
                case 'likes':
                    q = query(repliesRef, orderBy('likes', 'desc'), orderBy('createdAt', 'asc'));
                    break;
                case 'oldest':
                default:
                    q = query(repliesRef, orderBy('createdAt', 'asc'));
                    break;
            }

            const snapshot = await getDocs(q);
            const replies: ForumReply[] = snapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    threadId,
                    ...data,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
                } as ForumReply;
            });

            // Sort best answer to top if sorting by oldest
            if (sortBy === 'oldest') {
                replies.sort((a, b) => {
                    if (a.isBestAnswer && !b.isBestAnswer) return -1;
                    if (!a.isBestAnswer && b.isBestAnswer) return 1;
                    return 0;
                });
            }

            return replies;
        } catch (error) {
            console.error('Error fetching replies:', error);
            return [];
        }
    },

    /**
     * Obtiene una respuesta específica.
     */
    async getReply(threadId: string, replyId: string): Promise<ForumReply | null> {
        try {
            const replyRef = doc(db, THREADS_COLLECTION, threadId, 'replies', replyId);
            const replySnap = await getDoc(replyRef);

            if (!replySnap.exists()) return null;

            const data = replySnap.data();
            return {
                id: replySnap.id,
                threadId,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
            } as ForumReply;
        } catch (error) {
            console.error('Error fetching reply:', error);
            return null;
        }
    },

    /**
     * Agrega una respuesta a un hilo.
     */
    async addReply(
        threadId: string,
        replyData: {
            content: string;
            authorId: string;
            authorName: string;
            authorUsername?: string;
            authorAvatar?: string;
            authorRole?: string;
            parentId?: string;
        }
    ): Promise<ForumReply> {
        try {
            const repliesRef = collection(db, THREADS_COLLECTION, threadId, 'replies');
            const now = new Date().toISOString();

            const reply: Omit<ForumReply, 'id'> = {
                threadId,
                content: replyData.content,
                authorId: replyData.authorId,
                authorName: replyData.authorName,
                authorUsername: replyData.authorUsername,
                authorAvatar: replyData.authorAvatar,
                authorRole: replyData.authorRole,
                likes: 0,
                isBestAnswer: false,
                parentId: replyData.parentId,
                createdAt: now,
                isEdited: false
            };

            const docRef = await addDoc(repliesRef, sanitizeData(reply));

            // Update thread's reply count and lastActivityAt
            const threadRef = doc(db, THREADS_COLLECTION, threadId);
            await updateDoc(threadRef, {
                replies: increment(1),
                lastActivityAt: now
            });

            // Send notification to thread author (async, non-blocking)
            this.sendReplyNotification(threadId, replyData.authorId, replyData.authorName, replyData.authorAvatar).catch(console.error);

            return {
                id: docRef.id,
                ...reply
            };
        } catch (error) {
            console.error('Error adding reply:', error);
            throw error;
        }
    },

    /**
     * Envía notificación al autor del hilo.
     */
    async sendReplyNotification(
        threadId: string,
        replyAuthorId: string,
        replyAuthorName: string,
        replyAuthorAvatar?: string
    ): Promise<void> {
        try {
            // Get thread to find author
            const threadRef = doc(db, THREADS_COLLECTION, threadId);
            const threadSnap = await getDoc(threadRef);

            if (!threadSnap.exists()) return;

            const threadData = threadSnap.data();
            const threadAuthorId = threadData.authorId;

            // Don't notify if replying to own thread
            if (threadAuthorId === replyAuthorId) return;

            await notificationsService.createNotification(threadAuthorId, {
                type: 'comment',
                user: replyAuthorName,
                avatar: replyAuthorAvatar || '',
                content: `respondió a tu hilo "${threadData.title.substring(0, 40)}..."`,
                link: `/forum/${threadData.slug || threadId}`,
                read: false,
                time: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error sending reply notification:', error);
        }
    },

    /**
     * Actualiza el contenido de una respuesta.
     */
    async updateReply(
        threadId: string,
        replyId: string,
        content: string
    ): Promise<void> {
        try {
            const replyRef = doc(db, THREADS_COLLECTION, threadId, 'replies', replyId);
            await updateDoc(replyRef, {
                content,
                updatedAt: new Date().toISOString(),
                isEdited: true
            });
        } catch (error) {
            console.error('Error updating reply:', error);
            throw error;
        }
    },

    /**
     * Elimina una respuesta.
     */
    async deleteReply(threadId: string, replyId: string): Promise<void> {
        try {
            const replyRef = doc(db, THREADS_COLLECTION, threadId, 'replies', replyId);
            await deleteDoc(replyRef);

            // Decrement thread's reply count
            const threadRef = doc(db, THREADS_COLLECTION, threadId);
            await updateDoc(threadRef, {
                replies: increment(-1)
            });
        } catch (error) {
            console.error('Error deleting reply:', error);
            throw error;
        }
    },

    /**
     * Alterna el like de una respuesta.
     */
    async toggleReplyLike(
        threadId: string,
        replyId: string,
        userId: string
    ): Promise<boolean> {
        try {
            const likeRef = doc(db, THREADS_COLLECTION, threadId, 'replies', replyId, 'likes', userId);
            const likeSnap = await getDoc(likeRef);

            const replyRef = doc(db, THREADS_COLLECTION, threadId, 'replies', replyId);

            if (likeSnap.exists()) {
                // Remove like
                await deleteDoc(likeRef);
                await updateDoc(replyRef, { likes: increment(-1) });
                return false;
            } else {
                // Add like
                await setDoc(likeRef, {
                    createdAt: new Date().toISOString(),
                    userId
                });
                await updateDoc(replyRef, { likes: increment(1) });
                return true;
            }
        } catch (error) {
            console.error('Error toggling reply like:', error);
            throw error;
        }
    },

    /**
     * Verifica si un usuario ha dado like a una respuesta.
     */
    async getReplyLikeStatus(
        threadId: string,
        replyId: string,
        userId: string
    ): Promise<boolean> {
        try {
            const likeRef = doc(db, THREADS_COLLECTION, threadId, 'replies', replyId, 'likes', userId);
            const likeSnap = await getDoc(likeRef);
            return likeSnap.exists();
        } catch (error) {
            console.error('Error checking reply like status:', error);
            return false;
        }
    },

    /**
     * Obtiene el estado de likes de múltiples respuestas.
     */
    async getRepliesLikeStatuses(
        threadId: string,
        replyIds: string[],
        userId: string
    ): Promise<Record<string, boolean>> {
        try {
            const statuses: Record<string, boolean> = {};

            await Promise.all(
                replyIds.map(async (replyId) => {
                    const liked = await this.getReplyLikeStatus(threadId, replyId, userId);
                    statuses[replyId] = liked;
                })
            );

            return statuses;
        } catch (error) {
            console.error('Error getting replies like statuses:', error);
            return {};
        }
    },

    /**
     * Marca o desmarca una respuesta como mejor respuesta.
     */
    async toggleBestAnswer(
        threadId: string,
        replyId: string,
        markAsBest: boolean
    ): Promise<void> {
        try {
            const threadRef = doc(db, THREADS_COLLECTION, threadId);
            const replyRef = doc(db, THREADS_COLLECTION, threadId, 'replies', replyId);

            if (markAsBest) {
                // First, unmark any existing best answer
                const currentThread = await getDoc(threadRef);
                if (currentThread.exists() && currentThread.data().bestAnswerId) {
                    const oldBestRef = doc(
                        db,
                        THREADS_COLLECTION,
                        threadId,
                        'replies',
                        currentThread.data().bestAnswerId
                    );
                    await updateDoc(oldBestRef, { isBestAnswer: false }).catch(() => { });
                }

                // Mark new best answer
                await updateDoc(replyRef, { isBestAnswer: true });
                await updateDoc(threadRef, {
                    bestAnswerId: replyId,
                    isResolved: true
                });
            } else {
                // Unmark best answer
                await updateDoc(replyRef, { isBestAnswer: false });
                await updateDoc(threadRef, {
                    bestAnswerId: null,
                    isResolved: false
                });
            }
        } catch (error) {
            console.error('Error toggling best answer:', error);
            throw error;
        }
    },

    /**
     * Obtiene el conteo de respuestas de un hilo.
     */
    async getReplyCount(threadId: string): Promise<number> {
        try {
            const repliesRef = collection(db, THREADS_COLLECTION, threadId, 'replies');
            const snapshot = await getDocs(repliesRef);
            return snapshot.size;
        } catch (error) {
            console.error('Error getting reply count:', error);
            return 0;
        }
    }
};
