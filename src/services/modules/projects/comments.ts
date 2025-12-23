/**
 * Sistema de Comentarios de Proyectos
 * 
 * Módulo que maneja comentarios, respuestas y likes de comentarios
 * para proyectos de portafolio.
 * 
 * @module services/projects/comments
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
    onSnapshot,
    increment,
    addDoc
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export const projectsComments = {
    /**
     * Agrega un comentario a un proyecto.
     * 
     * Crea el comentario en Firestore y envía una notificación al autor
     * del proyecto (asíncrona, no bloqueante).
     * 
     * @param projectId - ID del proyecto
     * @param commentData - Datos del comentario (autor, texto, etc.)
     */
    addComment: async (projectId: string, commentData: { authorId: string; authorName: string; authorUsername?: string; authorAvatar: string; text: string; }) => {
        const commentsCol = collection(db, 'projects', projectId, 'comments');
        const newCommentRef = doc(commentsCol);
        await setDoc(newCommentRef, {
            ...commentData,
            id: newCommentRef.id,
            createdAt: new Date().toISOString(),
            likes: 0,
            replies: []
        });

        // Incrementar contador de comentarios
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            'stats.commentCount': increment(1)
        });

        // Enviar notificación (async, fire and forget)
        (async () => {
            try {
                const projectSnap = await getDoc(projectRef);
                const projectData = projectSnap.data();

                if (projectData && projectData.authorId && projectData.authorId !== commentData.authorId) {
                    await addDoc(collection(db, 'users', projectData.authorId, 'notifications'), {
                        type: 'comment',
                        user: commentData.authorName,
                        avatar: commentData.authorAvatar,
                        content: `comentó en tu proyecto "${projectData.title || 'Sin título'}"`,
                        image: projectData.image || '',
                        time: new Date().toISOString(),
                        read: false,
                        link: `/portfolio/${projectId}`
                    });
                }
            } catch (error) {
                console.error("Error creando notificación de comentario:", error);
            }
        })();
    },

    /**
     * Listener en tiempo real para comentarios de un proyecto.
     * 
     * Se actualiza automáticamente cuando se agregan, modifican o eliminan comentarios.
     * 
     * @param projectId - ID del proyecto
     * @param callback - Función que recibe el array de comentarios actualizados
     * @returns Función para cancelar la suscripción
     */
    listenToComments: (projectId: string, callback: (comments: any[]) => void) => {
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
     * Elimina un comentario de un proyecto.
     * 
     * También decrementa el contador de comentarios del proyecto.
     * 
     * @param projectId - ID del proyecto
     * @param commentId - ID del comentario a eliminar
     */
    deleteComment: async (projectId: string, commentId: string) => {
        const commentRef = doc(db, 'projects', projectId, 'comments', commentId);
        await deleteDoc(commentRef);

        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            'stats.commentCount': increment(-1)
        });
    },

    /**
     * Alterna el like de un comentario.
     * 
     * @param projectId - ID del proyecto
     * @param commentId - ID del comentario
     * @param userId - ID del usuario
     * @returns true si ahora tiene like, false si se quitó
     */
    toggleCommentLike: async (projectId: string, commentId: string, userId: string): Promise<boolean> => {
        try {
            const commentRef = doc(db, 'projects', projectId, 'comments', commentId);
            const likeRef = doc(db, 'projects', projectId, 'comments', commentId, 'likes', userId);

            const likeSnap = await getDoc(likeRef);
            const isLiked = likeSnap.exists();

            if (isLiked) {
                await deleteDoc(likeRef);
                await updateDoc(commentRef, { likes: increment(-1) });
                return false;
            } else {
                await setDoc(likeRef, {
                    userId,
                    createdAt: new Date().toISOString()
                });
                await updateDoc(commentRef, { likes: increment(1) });
                return true;
            }
        } catch (error) {
            console.error("Error alternando like de comentario:", error);
            throw error;
        }
    },

    /**
     * Verifica si un usuario ha dado like a un comentario.
     * 
     * @param projectId - ID del proyecto
     * @param commentId - ID del comentario
     * @param userId - ID del usuario
     * @returns true si el usuario dio like, false si no
     */
    getCommentLikeStatus: async (projectId: string, commentId: string, userId: string): Promise<boolean> => {
        try {
            const likeRef = doc(db, 'projects', projectId, 'comments', commentId, 'likes', userId);
            const snap = await getDoc(likeRef);
            return snap.exists();
        } catch (error) {
            console.error("Error verificando estado de like:", error);
            return false;
        }
    },

    /**
     * Obtiene el estado de likes para múltiples comentarios a la vez.
     * 
     * Útil para cargar el estado inicial de todos los comentarios
     * sin hacer múltiples llamadas individuales.
     * 
     * @param projectId - ID del proyecto
     * @param commentIds - Array de IDs de comentarios
     * @param userId - ID del usuario
     * @returns Objeto mapeando commentId => boolean (liked)
     */
    getCommentsLikeStatuses: async (projectId: string, commentIds: string[], userId: string): Promise<Record<string, boolean>> => {
        try {
            const statuses: Record<string, boolean> = {};

            const promises = commentIds.map(async (commentId) => {
                const likeRef = doc(db, 'projects', projectId, 'comments', commentId, 'likes', userId);
                const snap = await getDoc(likeRef);
                statuses[commentId] = snap.exists();
            });

            await Promise.all(promises);
            return statuses;
        } catch (error) {
            console.error("Error obteniendo estados de like:", error);
            return {};
        }
    },

    /**
     * Agrega una respuesta a un comentario.
     * 
     * Las respuestas se almacenan como comentarios regulares con
     * un campo parentId que indica a cuál comentario responden.
     * 
     * @param projectId - ID del proyecto
     * @param parentCommentId - ID del comentario padre
     * @param replyData - Datos de la respuesta
     * @returns ID de la respuesta creada
     */
    addCommentReply: async (
        projectId: string,
        parentCommentId: string,
        replyData: { authorId: string; authorName: string; authorUsername?: string; authorAvatar: string; text: string; }
    ) => {
        try {
            const commentsCol = collection(db, 'projects', projectId, 'comments');
            const newReplyRef = doc(commentsCol);

            await setDoc(newReplyRef, {
                ...replyData,
                id: newReplyRef.id,
                parentId: parentCommentId,
                createdAt: new Date().toISOString(),
                likes: 0
            });

            const projectRef = doc(db, 'projects', projectId);
            await updateDoc(projectRef, {
                'stats.commentCount': increment(1)
            });

            return newReplyRef.id;
        } catch (error) {
            console.error("Error agregando respuesta:", error);
            throw error;
        }
    }
};

