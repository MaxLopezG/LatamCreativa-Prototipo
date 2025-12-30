/**
 * Sistema de Comentarios de Artículos
 * 
 * Wrapper sobre el servicio compartido de comentarios.
 * Mantiene la API pública para compatibilidad con componentes existentes.
 * 
 * @module services/articles/comments
 */
import {
    collection,
    doc,
    updateDoc,
    query,
    orderBy,
    getDocs,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { BlogComment } from '../../../types';
import { articlesCommentsShared } from '../shared/comments';

export const articlesComments = {
    /**
     * Obtiene los comentarios de un artículo.
     * Wrapper sobre el servicio compartido con tipado específico.
     */
    getComments: async (articleId: string): Promise<BlogComment[]> => {
        const comments = await articlesCommentsShared.getComments(articleId);
        return comments as BlogComment[];
    },

    /**
     * Suscripción en tiempo real a los comentarios (para consistencia con projects).
     */
    listenToComments: (articleId: string, callback: (comments: BlogComment[]) => void) => {
        const commentsQuery = query(
            collection(db, 'articles', articleId, 'comments'),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(commentsQuery, (snapshot) => {
            const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogComment[];
            callback(comments);
        });
    },

    /**
     * Agrega un comentario a un artículo.
     */
    addComment: async (
        articleId: string,
        commentData: {
            authorId: string;
            authorName: string;
            authorUsername?: string;
            authorAvatar: string;
            text: string;
        }
    ): Promise<void> => {
        await articlesCommentsShared.addComment(articleId, commentData);
    },

    /**
     * Agrega una respuesta a un comentario.
     */
    addReply: async (
        articleId: string,
        parentCommentId: string,
        replyData: {
            authorId: string;
            authorName: string;
            authorUsername?: string;
            authorAvatar: string;
            text: string;
        }
    ): Promise<string> => {
        return articlesCommentsShared.addReply(articleId, parentCommentId, replyData);
    },

    /**
     * Alterna el like de un comentario.
     */
    toggleCommentLike: (articleId: string, commentId: string, userId: string): Promise<boolean> => {
        return articlesCommentsShared.toggleCommentLike(articleId, commentId, userId);
    },

    /**
     * Verifica si un usuario ha dado like a un comentario.
     */
    getCommentLikeStatus: (articleId: string, commentId: string, userId: string): Promise<boolean> => {
        return articlesCommentsShared.getCommentLikeStatus(articleId, commentId, userId);
    },

    /**
     * Obtiene el estado de likes para múltiples comentarios.
     */
    getCommentsLikeStatuses: (articleId: string, commentIds: string[], userId: string): Promise<Record<string, boolean>> => {
        return articlesCommentsShared.getCommentsLikeStatuses(articleId, commentIds, userId);
    },

    /**
     * Actualiza el contenido de un comentario.
     */
    updateComment: async (articleId: string, commentId: string, content: string): Promise<void> => {
        try {
            const commentRef = doc(db, 'articles', articleId, 'comments', commentId);
            await updateDoc(commentRef, { text: content, isEdited: true });
        } catch (error) {
            console.error("Error updating comment:", error);
            throw error;
        }
    },

    /**
     * Elimina un comentario.
     */
    deleteComment: (articleId: string, commentId: string): Promise<void> => {
        return articlesCommentsShared.deleteComment(articleId, commentId);
    }
};
