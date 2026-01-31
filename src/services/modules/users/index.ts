/**
 * Servicio de Usuarios
 * 
 * MODO LOCAL: Usa servicios locales en lugar de Firebase.
 * Para restaurar Firebase, descomenta las importaciones originales.
 * 
 * @module services/users
 */

// === MODO LOCAL (Sin Firebase) ===
import { localUsersService } from '../../local/users';
import { localAuthService } from '../../local/auth';

// Re-export type for backward compatibility
export type { UserProfile } from '../../../types/user';

/**
 * Servicio combinado - Usando servicios locales
 */
export const usersService = {
    // Operaciones de Perfil
    getUserProfile: localUsersService.getUserProfile,
    updateUserProfile: localUsersService.updateUserProfile,
    initializeUserProfile: async (user: any, extraData?: any) => {
        // En modo local, simplemente retornar el usuario existente o crear uno
        const existing = await localUsersService.getUserProfile(user.uid || user.id);
        if (existing) return existing;

        return localAuthService.register(
            user.email || '',
            'password',
            extraData?.name || user.displayName || 'Usuario'
        );
    },
    getUserProfileByUsername: localUsersService.getUserByUsername,
    checkUsernameAvailability: async (username: string) => {
        const user = await localUsersService.getUserByUsername(username);
        return !user;
    },
    listenToUserProfile: localUsersService.listenToUserProfile,
    listenToUserProfileByUsername: async () => () => { },
    getUserProfileByName: async () => null,
    getAllUsers: localUsersService.getAllUsers,
    getArtistDirectory: async () => ({ data: [], hasMore: false, lastDoc: null }),

    // Operaciones Sociales (stubs para modo local)
    getFollowers: async () => [],
    getFollowing: async () => [],
    subscribeToUser: async () => { },
    unsubscribeFromUser: async () => { },
    getSubscriptionStatus: async () => false,
    followUser: localUsersService.followUser,
    unfollowUser: localUsersService.unfollowUser,
    isFollowing: localUsersService.isFollowing,
    getChatMessages: async () => [],
    sendMessage: async () => { },
    incrementProfileViews: async () => { },
    getTotalProjectLikes: async () => 0,

    // Operaciones de Autenticación (stubs para modo local)
    updateUserEmail: async () => { },
    updateUserPassword: async () => { },
    deleteUserAccount: async () => { },
    sendVerificationEmail: async () => { },
    resetPassword: async () => { }
};

// === MODO FIREBASE (Comentado) ===
/*
import { usersProfile, UserProfile } from './profile';
import { usersSocial } from './social';
import { usersAuth } from './auth';

export const usersService = {
    getUserProfile: usersProfile.getUserProfile,
    updateUserProfile: usersProfile.updateUserProfile,
    initializeUserProfile: usersProfile.initializeUserProfile,
    getUserProfileByUsername: usersProfile.getUserProfileByUsername,
    checkUsernameAvailability: usersProfile.checkUsernameAvailability,
    listenToUserProfile: usersProfile.listenToUserProfile,
    listenToUserProfileByUsername: usersProfile.listenToUserProfileByUsername,
    getUserProfileByName: usersProfile.getUserProfileByName,
    getAllUsers: usersProfile.getAllUsers,
    getArtistDirectory: usersProfile.getArtistDirectory,
    getFollowers: usersSocial.getFollowers,
    getFollowing: usersSocial.getFollowing,
    subscribeToUser: usersSocial.subscribeToUser,
    unsubscribeFromUser: usersSocial.unsubscribeFromUser,
    getSubscriptionStatus: usersSocial.getSubscriptionStatus,
    followUser: usersSocial.followUser,
    unfollowUser: usersSocial.unfollowUser,
    isFollowing: usersSocial.isFollowing,
    getChatMessages: usersSocial.getChatMessages,
    sendMessage: usersSocial.sendMessage,
    incrementProfileViews: usersSocial.incrementProfileViews,
    getTotalProjectLikes: usersSocial.getTotalProjectLikes,
    updateUserEmail: usersAuth.updateUserEmail,
    updateUserPassword: usersAuth.updateUserPassword,
    deleteUserAccount: usersAuth.deleteUserAccount,
    sendVerificationEmail: usersAuth.sendVerificationEmail,
    resetPassword: usersAuth.resetPassword
};

export { usersProfile } from './profile';
export { usersSocial } from './social';
export { usersAuth } from './auth';
export type { UserProfile } from './profile';
*/
