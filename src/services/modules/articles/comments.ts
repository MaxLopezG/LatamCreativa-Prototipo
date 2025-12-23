/**
 * Sistema de Comentarios de Artículos
 * 
 * Módulo que maneja comentarios, respuestas y likes de comentarios
 * para artículos del blog.
 * 
 * @module services/articles/comments
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
import { BlogComment } from '../../../types';
import { sanitizeData } from '../utils';

export const articlesComments = {
    /**
     * Obtiene los comentarios de un artículo.
     * 
     * Incluye cálculo automático de "timeAgo" para cada comentario.
     * 
     * @param articleId - ID del artículo
     * @returns Array de comentarios con timeAgo calculado
     */
    getComments: async (articleId: string): Promise<BlogComment[]> => {
        try {
            const q = query(
                collection(db, 'articles', articleId, 'comments'),
                orderBy('date', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                const date = new Date(data.date);
                const now = new Date();
                const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
                let timeAgo = 'Hace un momento';
                if (diffInHours >= 24) timeAgo = `Hace ${Math.floor(diffInHours / 24)} días`;
                else if (diffInHours >= 1) timeAgo = `Hace ${Math.floor(diffInHours)} horas`;

                return {
                    id: doc.id,
                    ...data,
                    timeAgo
                } as BlogComment;
            });
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },

    /**
     * Agrega un comentario a un artículo.
     * 
     * Envía notificación al autor del artículo (asíncrona, no bloqueante).
     * 
     * @param articleId - ID del artículo
     * @param commentData - Datos del comentario (autor, texto, etc.)
     */
    addComment: async (articleId: string, commentData: { authorId: string; authorName: string; authorUsername?: string; authorAvatar: string; text: string; parentId?: string }): Promise<void> => {
        try {
            const commentsCol = collection(db, 'articles', articleId, 'comments');
            const newCommentRef = doc(commentsCol);

            const finalComment = sanitizeData({
                ...commentData,
                id: newCommentRef.id,
                createdAt: new Date().toISOString(),
                likes: 0
            });

            await setDoc(newCommentRef, finalComment);

            const articleRef = doc(db, 'articles', articleId);

            try {
                const articleSnap = await getDoc(articleRef);
                const articleData = articleSnap.data();

                await updateDoc(articleRef, { comments: increment(1) });

                // Send notification to article author (async, non-blocking)
                if (articleData && articleData.authorId && articleData.authorId !== commentData.authorId) {
                    addDoc(collection(db, 'users', articleData.authorId, 'notifications'), {
                        type: 'comment',
                        user: commentData.authorName,
                        avatar: commentData.authorAvatar,
                        content: `comentó en tu artículo "${articleData.title || 'Sin título'}"`,
                        link: `/blog/${articleId}`,
                        time: new Date().toISOString(),
                        read: false
                    }).catch(err => console.warn('Could not create comment notification:', err));
                }
            } catch (updateError) {
                console.warn("Could not update comment count:", updateError);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    },

    /**
     * Alterna el like de un comentario.
     * 
     * @param articleId - ID del artículo
     * @param commentId - ID del comentario
     * @param userId - ID del usuario
     * @returns true si ahora tiene like, false si se quitó
     */
    toggleCommentLike: async (articleId: string, commentId: string, userId: string): Promise<boolean> => {
        try {
            const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
            const likeRef = doc(db, 'articles', articleId, 'comments', commentId, 'likes', userId);

            const likeSnap = await getDoc(likeRef);
            const isLiked = likeSnap.exists();

            if (isLiked) {
                await deleteDoc(likeRef);
                await updateDoc(commentRef, { likes: increment(-1) });
                return false;
            } else {
                await setDoc(likeRef, { userId, createdAt: new Date().toISOString() });
                await updateDoc(commentRef, { likes: increment(1) });
                return true;
            }
        } catch (error) {
            console.error("Error toggling comment like:", error);
            throw error;
        }
    },

    /**
     * Verifica si un usuario ha dado like a un comentario.
     * 
     * @param articleId - ID del artículo
     * @param commentId - ID del comentario
     * @param userId - ID del usuario
     * @returns true si el usuario dio like, false si no
     */
    getCommentLikeStatus: async (articleId: string, commentId: string, userId: string): Promise<boolean> => {
        try {
            const likeRef = doc(db, 'articles', articleId, 'comments', commentId, 'likes', userId);
            const snap = await getDoc(likeRef);
            return snap.exists();
        } catch (error) {
            console.error("Error checking comment like status:", error);
            return false;
        }
    },

    /**
     * Obtiene el estado de likes para múltiples comentarios a la vez.
     * 
     * Útil para cargar el estado inicial sin hacer múltiples llamadas.
     * 
     * @param articleId - ID del artículo
     * @param commentIds - Array de IDs de comentarios
     * @param userId - ID del usuario
     * @returns Objeto mapeando commentId => boolean (liked)
     */
    getCommentsLikeStatuses: async (articleId: string, commentIds: string[], userId: string): Promise<Record<string, boolean>> => {
        try {
            const statuses: Record<string, boolean> = {};

            const promises = commentIds.map(async (commentId) => {
                const likeRef = doc(db, 'articles', articleId, 'comments', commentId, 'likes', userId);
                const snap = await getDoc(likeRef);
                statuses[commentId] = snap.exists();
            });

            await Promise.all(promises);
            return statuses;
        } catch (error) {
            console.error("Error fetching comment like statuses:", error);
            return {};
        }
    },

    /**
     * Actualiza el contenido de un comentario.
     * 
     * @param articleId - ID del artículo
     * @param commentId - ID del comentario
     * @param content - Nuevo contenido
     */
    updateComment: async (articleId: string, commentId: string, content: string): Promise<void> => {
        try {
            const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
            await updateDoc(commentRef, { content, isEdited: true });
        } catch (error) {
            console.error("Error updating comment:", error);
            throw error;
        }
    },

    /**
     * Elimina un comentario.
     * 
     * También decrementa el contador de comentarios del artículo.
     * 
     * @param articleId - ID del artículo
     * @param commentId - ID del comentario
     */
    deleteComment: async (articleId: string, commentId: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, 'articles', articleId, 'comments', commentId));
            const articleRef = doc(db, 'articles', articleId);
            await updateDoc(articleRef, { comments: increment(-1) });
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
};
