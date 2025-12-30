/**
 * Sistema de Comentarios de Proyectos
 * 
 * Wrapper sobre el servicio compartido de comentarios.
 * Mantiene la API pública para compatibilidad con componentes existentes.
 * 
 * @module services/projects/comments
 */
import {
    collection,
    query,
    orderBy,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { projectsCommentsShared } from '../shared/comments';

export const projectsComments = {
    /**
     * Obtiene los comentarios de un proyecto (fetch único).
     */
    getComments: async (projectId: string) => {
        return projectsCommentsShared.getComments(projectId);
    },

    /**
     * Listener en tiempo real para comentarios de un proyecto.
     */
    listenToComments: (projectId: string, callback: (comments: Array<{ id: string;[key: string]: unknown }>) => void) => {
        const commentsQuery = query(
            collection(db, 'projects', projectId, 'comments'),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(commentsQuery, (snapshot) => {
            const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(comments);
        });
    },

    /**
     * Agrega un comentario a un proyecto.
     */
    addComment: async (
        projectId: string,
        commentData: {
            authorId: string;
            authorName: string;
            authorUsername?: string;
            authorAvatar: string;
            text: string;
        }
    ) => {
        return projectsCommentsShared.addComment(projectId, commentData);
    },

    /**
     * Agrega una respuesta a un comentario (alias de addReply).
     */
    addCommentReply: async (
        projectId: string,
        parentCommentId: string,
        replyData: {
            authorId: string;
            authorName: string;
            authorUsername?: string;
            authorAvatar: string;
            text: string;
        }
    ) => {
        return projectsCommentsShared.addReply(projectId, parentCommentId, replyData);
    },

    /**
     * Alterna el like de un comentario.
     */
    toggleCommentLike: (projectId: string, commentId: string, userId: string): Promise<boolean> => {
        return projectsCommentsShared.toggleCommentLike(projectId, commentId, userId);
    },

    /**
     * Verifica si un usuario ha dado like a un comentario.
     */
    getCommentLikeStatus: (projectId: string, commentId: string, userId: string): Promise<boolean> => {
        return projectsCommentsShared.getCommentLikeStatus(projectId, commentId, userId);
    },

    /**
     * Obtiene el estado de likes para múltiples comentarios.
     */
    getCommentsLikeStatuses: (projectId: string, commentIds: string[], userId: string): Promise<Record<string, boolean>> => {
        return projectsCommentsShared.getCommentsLikeStatuses(projectId, commentIds, userId);
    },

    /**
     * Elimina un comentario.
     */
    deleteComment: (projectId: string, commentId: string): Promise<void> => {
        return projectsCommentsShared.deleteComment(projectId, commentId);
    }
};
