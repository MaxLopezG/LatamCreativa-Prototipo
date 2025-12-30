/**
 * Operaciones Sociales de Usuario
 * 
 * Módulo que maneja followers, following, suscripciones,
 * chat (placeholder) y estadísticas de perfil.
 * 
 * @module services/users/social
 */
import {
    collection,
    query,
    getDocs,
    getDoc,
    doc,
    where,
    updateDoc,
    increment,
    addDoc,
    writeBatch
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { usersProfile } from './profile';

export const usersSocial = {
    /**
     * Obtiene la lista de IDs de seguidores.
     * 
     * @param userId - ID del usuario
     * @returns Array de IDs de usuarios que lo siguen
     */
    getFollowers: async (userId: string): Promise<string[]> => {
        try {
            const followersRef = collection(db, 'users', userId, 'followers');
            const snapshot = await getDocs(followersRef);
            return snapshot.docs.map(doc => doc.id);
        } catch (error) {
            console.error("Error fetching followers:", error);
            return [];
        }
    },

    /**
     * Obtiene la lista de IDs de usuarios que sigue.
     * 
     * @param userId - ID del usuario
     * @returns Array de IDs de usuarios que sigue
     */
    getFollowing: async (userId: string): Promise<string[]> => {
        try {
            const followingRef = collection(db, 'users', userId, 'following');
            const snapshot = await getDocs(followingRef);
            return snapshot.docs.map(doc => doc.id);
        } catch (error) {
            console.error("Error fetching following:", error);
            return [];
        }
    },

    /**
     * Sigue a un usuario.
     * 
     * Proceso atómico con batch:
     * 1. Agrega al follower en la subcolección del target
     * 2. Agrega al following en la subcolección del current
     * 3. Incrementa contadores de ambos usuarios
     * 4. Envía notificación al usuario seguido
     * 
     * @param targetUserId - ID del usuario a seguir
     * @param currentUserId - ID del usuario que sigue
     */
    subscribeToUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        try {
            const currentUserProfile = await usersProfile.getUserProfile(currentUserId);

            const followerData = {
                since: new Date().toISOString(),
                followerId: currentUserId,
                followerName: currentUserProfile?.name || 'Usuario',
                followerUsername: currentUserProfile?.username || '',
                followerAvatar: currentUserProfile?.avatar || ''
            };

            const batch = writeBatch(db);

            // Add to target's followers
            const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
            batch.set(followerRef, followerData);

            // Add to current's following
            const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
            batch.set(followingRef, {
                since: new Date().toISOString(),
                followingId: targetUserId
            });

            // Update Counters
            const targetUserRef = doc(db, 'users', targetUserId);
            batch.update(targetUserRef, { 'stats.followers': increment(1) });

            const currentUserRef = doc(db, 'users', currentUserId);
            batch.update(currentUserRef, { 'stats.following': increment(1) });

            await batch.commit();

            // Create Notification
            try {
                await addDoc(collection(db, 'users', targetUserId, 'notifications'), {
                    type: 'follow',
                    user: currentUserProfile?.name || 'Alguien',
                    avatar: currentUserProfile?.avatar || '',
                    content: 'ha comenzado a seguirte',
                    time: new Date().toISOString(),
                    read: false,
                    link: `/user/${currentUserProfile?.username || currentUserId}`
                });
            } catch (notifError) {
                console.error("Error sending follow notification:", notifError);
            }
        } catch (error) {
            console.error("Error subscribing:", error);
            throw error;
        }
    },

    /**
     * Deja de seguir a un usuario.
     * 
     * Proceso atómico con batch que revierte subscribeToUser.
     * 
     * @param targetUserId - ID del usuario a dejar de seguir
     * @param currentUserId - ID del usuario que deja de seguir
     */
    unsubscribeFromUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        try {
            const batch = writeBatch(db);

            const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
            batch.delete(followerRef);

            const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
            batch.delete(followingRef);

            const targetUserRef = doc(db, 'users', targetUserId);
            batch.update(targetUserRef, { 'stats.followers': increment(-1) });

            const currentUserRef = doc(db, 'users', currentUserId);
            batch.update(currentUserRef, { 'stats.following': increment(-1) });

            await batch.commit();
        } catch (error) {
            console.error("Error unsubscribing:", error);
            throw error;
        }
    },

    /**
     * Verifica si el usuario actual sigue al usuario objetivo.
     * 
     * @param targetUserId - ID del usuario objetivo
     * @param currentUserId - ID del usuario actual
     * @returns true si lo sigue, false si no
     */
    getSubscriptionStatus: async (targetUserId: string, currentUserId: string): Promise<boolean> => {
        try {
            const docRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
            const snap = await getDoc(docRef);
            return snap.exists();
        } catch (error) {
            console.error("Error checking subscription:", error);
            return false;
        }
    },

    // --- Métodos de Chat (Placeholder) ---
    /**
     * Obtiene mensajes de chat (placeholder).
     * @returns Array vacío (por implementar)
     */
    getChatMessages: async (friendId: string): Promise<{ id: string; text: string; senderId: string }[]> => {
        return [];
    },

    /**
     * Envía un mensaje (placeholder).
     * Simula un delay de red.
     */
    sendMessage: async ({ friendId, text }: { friendId: string, text: string }): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
    },

    /**
     * Incrementa el contador de vistas de perfil.
     * 
     * Se llama cuando alguien visita un perfil (no el propio).
     * 
     * @param userId - ID del usuario cuyo perfil fue visitado
     */
    incrementProfileViews: async (userId: string): Promise<void> => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { 'stats.views': increment(1) });
        } catch (error) {
            console.error("Error incrementing profile views:", error);
        }
    },

    /**
     * Calcula el total de likes en todos los proyectos del usuario.
     * 
     * @param userId - ID del usuario
     * @returns Suma total de likes en todos sus proyectos
     */
    getTotalProjectLikes: async (userId: string): Promise<number> => {
        try {
            const projectsQuery = query(
                collection(db, 'projects'),
                where('authorId', '==', userId)
            );

            const snapshot = await getDocs(projectsQuery);
            let totalLikes = 0;

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                totalLikes += Number(data.likes || 0) + Number(data.stats?.likeCount || 0);
            });

            return totalLikes;
        } catch (error) {
            console.error("Error calculating total project likes:", error);
            return 0;
        }
    },

    // --- Alias semánticos para mejor legibilidad ---
    /** Alias de subscribeToUser - sigue a un usuario */
    followUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        return usersSocial.subscribeToUser(targetUserId, currentUserId);
    },

    /** Alias de unsubscribeFromUser - deja de seguir a un usuario */
    unfollowUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        return usersSocial.unsubscribeFromUser(targetUserId, currentUserId);
    },

    /** Alias de getSubscriptionStatus - verifica si sigue a un usuario */
    isFollowing: async (targetUserId: string, currentUserId: string): Promise<boolean> => {
        return usersSocial.getSubscriptionStatus(targetUserId, currentUserId);
    }
};
