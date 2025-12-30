/**
 * Factory de Servicios de Comentarios
 * 
 * Genera funciones de comentarios parametrizadas por tipo de colección.
 * Permite reutilizar la misma lógica para Articles y Projects.
 * 
 * @module services/shared/comments
 */
import {
    collection,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    getDocs,
    increment,
    addDoc
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { sanitizeData } from '../utils';

// Tipos de contenido soportados
type ContentType = 'articles' | 'projects';

// Configuración específica por tipo de contenido
const CONFIG: Record<ContentType, {
    statsField: string;
    routePrefix: string;
    contentLabel: string;
}> = {
    articles: {
        statsField: 'comments',
        routePrefix: '/blog',
        contentLabel: 'artículo'
    },
    projects: {
        statsField: 'stats.commentCount',
        routePrefix: '/portfolio',
        contentLabel: 'proyecto'
    }
};

/**
 * Calcula el tiempo transcurrido en formato legible.
 */
const calculateTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours >= 24) return `Hace ${Math.floor(diffInHours / 24)} días`;
    if (diffInHours >= 1) return `Hace ${Math.floor(diffInHours)} horas`;
    return 'Hace un momento';
};

/**
 * Factory que crea un servicio de comentarios para un tipo de contenido específico.
 * 
 * @param contentType - 'articles' o 'projects'
 * @returns Objeto con todas las funciones de comentarios
 */
export const createCommentsService = (contentType: ContentType) => {
    const config = CONFIG[contentType];

    return {
        /**
         * Obtiene los comentarios de un item, ordenados por fecha descendente.
         */
        getComments: async (itemId: string) => {
            try {
                const q = query(
                    collection(db, contentType, itemId, 'comments'),
                    orderBy('createdAt', 'desc')
                );
                const snapshot = await getDocs(q);

                return snapshot.docs.map(docSnap => {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        ...data,
                        timeAgo: calculateTimeAgo(data.createdAt || data.date)
                    };
                });
            } catch (error) {
                console.error(`Error fetching comments for ${contentType}:`, error);
                return [];
            }
        },

        /**
         * Agrega un comentario al item.
         * Envía notificación al autor del contenido.
         */
        addComment: async (
            itemId: string,
            commentData: {
                authorId: string;
                authorName: string;
                authorUsername?: string;
                authorAvatar: string;
                text: string;
            }
        ): Promise<string> => {
            try {
                const commentsCol = collection(db, contentType, itemId, 'comments');
                const newCommentRef = doc(commentsCol);

                const finalComment = sanitizeData({
                    ...commentData,
                    id: newCommentRef.id,
                    createdAt: new Date().toISOString(),
                    likes: 0
                });

                await setDoc(newCommentRef, finalComment);

                // Incrementar contador de comentarios
                const itemRef = doc(db, contentType, itemId);
                await updateDoc(itemRef, { [config.statsField]: increment(1) });

                // Enviar notificación al autor (non-blocking)
                (async () => {
                    try {
                        const itemSnap = await getDoc(itemRef);
                        const itemData = itemSnap.data();

                        if (itemData && itemData.authorId && itemData.authorId !== commentData.authorId) {
                            await addDoc(collection(db, 'users', itemData.authorId, 'notifications'), {
                                type: 'comment',
                                user: commentData.authorName,
                                avatar: commentData.authorAvatar,
                                content: `comentó en tu ${config.contentLabel} "${itemData.title || 'Sin título'}"`,
                                link: `${config.routePrefix}/${itemId}`,
                                time: new Date().toISOString(),
                                read: false
                            });
                        }
                    } catch (notifError) {
                        console.warn('Could not create comment notification:', notifError);
                    }
                })();

                return newCommentRef.id;
            } catch (error) {
                console.error(`Error adding comment to ${contentType}:`, error);
                throw error;
            }
        },

        /**
         * Agrega una respuesta a un comentario existente.
         * Envía notificación al autor del comentario original.
         */
        addReply: async (
            itemId: string,
            parentCommentId: string,
            replyData: {
                authorId: string;
                authorName: string;
                authorUsername?: string;
                authorAvatar: string;
                text: string;
            }
        ): Promise<string> => {
            try {
                const commentsCol = collection(db, contentType, itemId, 'comments');
                const newReplyRef = doc(commentsCol);

                const finalReply = sanitizeData({
                    ...replyData,
                    id: newReplyRef.id,
                    parentId: parentCommentId,
                    createdAt: new Date().toISOString(),
                    likes: 0
                });

                await setDoc(newReplyRef, finalReply);

                // Incrementar contador
                const itemRef = doc(db, contentType, itemId);
                await updateDoc(itemRef, { [config.statsField]: increment(1) });

                // Notificar al autor del comentario padre (non-blocking)
                (async () => {
                    try {
                        const parentCommentRef = doc(db, contentType, itemId, 'comments', parentCommentId);
                        const parentSnap = await getDoc(parentCommentRef);
                        const parentData = parentSnap.data();

                        if (parentData && parentData.authorId && parentData.authorId !== replyData.authorId) {
                            await addDoc(collection(db, 'users', parentData.authorId, 'notifications'), {
                                type: 'comment',
                                user: replyData.authorName,
                                avatar: replyData.authorAvatar,
                                content: `respondió a tu comentario`,
                                link: `${config.routePrefix}/${itemId}`,
                                time: new Date().toISOString(),
                                read: false
                            });
                        }
                    } catch (notifError) {
                        console.warn('Could not create reply notification:', notifError);
                    }
                })();

                return newReplyRef.id;
            } catch (error) {
                console.error(`Error adding reply to ${contentType}:`, error);
                throw error;
            }
        },

        /**
         * Elimina un comentario.
         */
        deleteComment: async (itemId: string, commentId: string): Promise<void> => {
            try {
                await deleteDoc(doc(db, contentType, itemId, 'comments', commentId));

                const itemRef = doc(db, contentType, itemId);
                await updateDoc(itemRef, { [config.statsField]: increment(-1) });
            } catch (error) {
                console.error(`Error deleting comment from ${contentType}:`, error);
                throw error;
            }
        },

        /**
         * Alterna el like de un comentario.
         */
        toggleCommentLike: async (itemId: string, commentId: string, userId: string): Promise<boolean> => {
            try {
                const commentRef = doc(db, contentType, itemId, 'comments', commentId);
                const likeRef = doc(db, contentType, itemId, 'comments', commentId, 'likes', userId);

                const likeSnap = await getDoc(likeRef);
                const isLiked = likeSnap.exists();

                if (isLiked) {
                    await deleteDoc(likeRef);
                    await updateDoc(commentRef, { likes: increment(-1) });
                    return false;
                } else {
                    await setDoc(likeRef, { userId, createdAt: new Date().toISOString() });
                    await updateDoc(commentRef, { likes: increment(1) });

                    // Notificar al autor del comentario (non-blocking)
                    (async () => {
                        try {
                            const commentSnap = await getDoc(commentRef);
                            const commentData = commentSnap.data();
                            const userRef = doc(db, 'users', userId);
                            const userSnap = await getDoc(userRef);
                            const userData = userSnap.data();

                            if (commentData && commentData.authorId && commentData.authorId !== userId) {
                                await addDoc(collection(db, 'users', commentData.authorId, 'notifications'), {
                                    type: 'like',
                                    user: userData?.name || 'Alguien',
                                    avatar: userData?.avatar || '',
                                    content: `le gustó tu comentario`,
                                    link: `${config.routePrefix}/${itemId}`,
                                    time: new Date().toISOString(),
                                    read: false
                                });
                            }
                        } catch (notifError) {
                            console.warn('Could not create like notification:', notifError);
                        }
                    })();

                    return true;
                }
            } catch (error) {
                console.error(`Error toggling comment like in ${contentType}:`, error);
                throw error;
            }
        },

        /**
         * Verifica si un usuario ha dado like a un comentario.
         */
        getCommentLikeStatus: async (itemId: string, commentId: string, userId: string): Promise<boolean> => {
            try {
                const likeRef = doc(db, contentType, itemId, 'comments', commentId, 'likes', userId);
                const snap = await getDoc(likeRef);
                return snap.exists();
            } catch (error) {
                console.error(`Error checking comment like in ${contentType}:`, error);
                return false;
            }
        },

        /**
         * Obtiene el estado de likes para múltiples comentarios.
         */
        getCommentsLikeStatuses: async (
            itemId: string,
            commentIds: string[],
            userId: string
        ): Promise<Record<string, boolean>> => {
            try {
                const statuses: Record<string, boolean> = {};

                await Promise.all(commentIds.map(async (commentId) => {
                    const likeRef = doc(db, contentType, itemId, 'comments', commentId, 'likes', userId);
                    const snap = await getDoc(likeRef);
                    statuses[commentId] = snap.exists();
                }));

                return statuses;
            } catch (error) {
                console.error(`Error fetching comment like statuses in ${contentType}:`, error);
                return {};
            }
        }
    };
};

// Pre-crear servicios para uso directo
export const articlesCommentsShared = createCommentsService('articles');
export const projectsCommentsShared = createCommentsService('projects');
