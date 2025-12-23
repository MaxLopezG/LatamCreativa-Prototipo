/**
 * Servicio de Usuarios
 * 
 * Re-exporta todas las operaciones de usuario desde módulos separados.
 * Mantiene compatibilidad con imports existentes.
 * 
 * @module services/users
 */
import { usersProfile, UserProfile } from './profile';
import { usersSocial } from './social';

/**
 * Servicio combinado que integra todos los sub-módulos de usuarios
 */
export const usersService = {
    // Operaciones de Perfil
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

    // Operaciones Sociales
    getFollowers: usersSocial.getFollowers,
    getFollowing: usersSocial.getFollowing,
    subscribeToUser: usersSocial.subscribeToUser,
    unsubscribeFromUser: usersSocial.unsubscribeFromUser,
    getSubscriptionStatus: usersSocial.getSubscriptionStatus,
    getChatMessages: usersSocial.getChatMessages,
    sendMessage: usersSocial.sendMessage,
    incrementProfileViews: usersSocial.incrementProfileViews,
    getTotalProjectLikes: usersSocial.getTotalProjectLikes
};

// Re-exportar sub-módulos y tipos
export { usersProfile } from './profile';
export { usersSocial } from './social';
export type { UserProfile } from './profile';
