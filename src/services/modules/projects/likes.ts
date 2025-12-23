/**
 * Sistema de Likes para Proyectos
 * 
 * Módulo que maneja vistas y likes de proyectos de portafolio.
 * Incluye notificaciones automáticas al autor del proyecto.
 * 
 * @module services/projects/likes
 */
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc,
    writeBatch,
    increment
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export const projectsLikes = {
    /**
     * Incrementa el contador de vistas de un proyecto.
     * 
     * Se llama automáticamente cuando alguien visita un proyecto.
     * Actualiza tanto 'stats.viewCount' como 'views' para compatibilidad.
     * 
     * @param projectId - ID del proyecto
     */
    incrementProjectView: async (projectId: string): Promise<void> => {
        try {
            const ref = doc(db, 'projects', projectId);
            await updateDoc(ref, {
                'stats.viewCount': increment(1),
                'views': increment(1)
            });
        } catch (error) {
            console.error("Error incrementing view:", error);
        }
    },

    /**
     * Alterna el like de un proyecto.
     * 
     * Si el usuario ya dio like, lo quita. Si no, lo agrega.
     * Envía/elimina notificación al autor automáticamente (no bloqueante).
     * 
     * @param projectId - ID del proyecto
     * @param userId - ID del usuario que da/quita like
     * @returns true si ahora tiene like, false si se quitó
     */
    toggleProjectLike: async (projectId: string, userId: string): Promise<boolean> => {
        try {
            const projectRef = doc(db, 'projects', projectId);
            const likeRef = doc(db, 'projects', projectId, 'likes', userId);
            const userRef = doc(db, 'users', userId);

            const [projectSnap, likeSnap, userSnap] = await Promise.all([
                getDoc(projectRef),
                getDoc(likeRef),
                getDoc(userRef)
            ]);

            const projectData = projectSnap.data();
            const userData = userSnap.data();
            const isLiked = likeSnap.exists();

            const batch = writeBatch(db);

            if (isLiked) {
                // UNLIKE
                batch.delete(likeRef);
                batch.update(projectRef, {
                    'stats.likeCount': increment(-1),
                    'likes': increment(-1)
                });
            } else {
                // LIKE
                batch.set(likeRef, {
                    userId,
                    createdAt: new Date().toISOString()
                });
                batch.update(projectRef, {
                    'stats.likeCount': increment(1),
                    'likes': increment(1)
                });
            }

            await batch.commit();

            // Handle notifications AFTER the main batch (non-blocking)
            if (projectData && projectData.authorId && projectData.authorId !== userId) {
                const notifId = `like_${projectId}_${userId}`;
                const notifRef = doc(db, 'users', projectData.authorId, 'notifications', notifId);

                try {
                    if (isLiked) {
                        await deleteDoc(notifRef);
                    } else {
                        await setDoc(notifRef, {
                            type: 'like',
                            user: userData?.name || 'Alguien',
                            avatar: userData?.avatar || '',
                            content: `le gustó tu proyecto "${projectData.title || 'Sin título'}"`,
                            image: projectData.image || '',
                            time: new Date().toISOString(),
                            read: false,
                            link: `/portfolio/${projectId}`
                        });
                    }
                } catch (notifError) {
                    console.warn('Notification operation failed (non-critical):', notifError);
                }
            }

            return !isLiked;
        } catch (error) {
            console.error("Error toggling like:", error);
            throw error;
        }
    },

    /**
     * Verifica si un usuario ha dado like a un proyecto.
     * 
     * @param projectId - ID del proyecto
     * @param userId - ID del usuario
     * @returns true si el usuario dio like, false si no
     */
    getProjectLikeStatus: async (projectId: string, userId: string): Promise<boolean> => {
        try {
            const likeRef = doc(db, 'projects', projectId, 'likes', userId);
            const snap = await getDoc(likeRef);
            return snap.exists();
        } catch (error) {
            return false;
        }
    }
};
