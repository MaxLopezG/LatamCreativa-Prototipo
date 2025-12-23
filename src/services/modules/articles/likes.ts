/**
 * Sistema de Likes para Artículos
 * 
 * Módulo que maneja los likes de artículos del blog.
 * Incluye notificaciones automáticas al autor.
 * 
 * @module services/articles/likes
 */
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    increment
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export const articlesLikes = {
    /**
     * Verifica si un usuario ha dado like a un artículo.
     * 
     * @param articleId - ID del artículo
     * @param userId - ID del usuario
     * @returns true si el usuario dio like, false si no
     */
    getArticleLikeStatus: async (articleId: string, userId: string): Promise<boolean> => {
        try {
            const docRef = doc(db, 'articles', articleId, 'likes', userId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists();
        } catch (error) {
            console.error("Error verificando estado de like:", error);
            return false;
        }
    },

    /**
     * Alterna el like de un artículo.
     * 
     * Si el usuario ya dio like, lo quita. Si no, lo agrega.
     * Envía/elimina notificación al autor automáticamente (no bloqueante).
     * 
     * @param articleId - ID del artículo
     * @param userId - ID del usuario que da/quita like
     * @param likerInfo - Información del usuario para la notificación (opcional)
     * @returns true si ahora tiene like, false si se quitó
     */
    toggleArticleLike: async (articleId: string, userId: string, likerInfo?: { name: string; avatar: string }): Promise<boolean> => {
        try {
            const likeRef = doc(db, 'articles', articleId, 'likes', userId);
            const articleRef = doc(db, 'articles', articleId);
            const [likeSnap, articleSnap] = await Promise.all([
                getDoc(likeRef),
                getDoc(articleRef)
            ]);

            const articleData = articleSnap.data();
            const isLiked = likeSnap.exists();

            if (isLiked) {
                // Quitar like
                await deleteDoc(likeRef);
                await updateDoc(articleRef, { likes: increment(-1) });

                // Eliminar notificación (async, no bloqueante)
                if (articleData && articleData.authorId && articleData.authorId !== userId) {
                    const notifId = `like_article_${articleId}_${userId}`;
                    const notifRef = doc(db, 'users', articleData.authorId, 'notifications', notifId);
                    deleteDoc(notifRef).catch(err => console.warn('No se pudo eliminar notificación de like:', err));
                }

                return false;
            } else {
                // Dar like
                await setDoc(likeRef, { date: new Date().toISOString() });
                await updateDoc(articleRef, { likes: increment(1) });

                // Enviar notificación (async, no bloqueante)
                if (articleData && articleData.authorId && articleData.authorId !== userId && likerInfo) {
                    const notifId = `like_article_${articleId}_${userId}`;
                    const notifRef = doc(db, 'users', articleData.authorId, 'notifications', notifId);
                    setDoc(notifRef, {
                        type: 'like',
                        user: likerInfo.name,
                        avatar: likerInfo.avatar,
                        content: `le dio me gusta a tu artículo "${articleData.title || 'Sin título'}"`,
                        link: `/blog/${articleId}`,
                        time: new Date().toISOString(),
                        read: false
                    }).catch(err => console.warn('No se pudo crear notificación de like:', err));
                }

                return true;
            }
        } catch (error) {
            console.error("Error alternando like:", error);
            throw error;
        }
    }
};

