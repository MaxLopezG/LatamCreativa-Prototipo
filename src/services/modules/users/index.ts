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
import { usersAuth } from './auth';

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
    // Alias semánticos para Follow
    followUser: usersSocial.followUser,
    unfollowUser: usersSocial.unfollowUser,
    isFollowing: usersSocial.isFollowing,
    // Otros
    getChatMessages: usersSocial.getChatMessages,
    sendMessage: usersSocial.sendMessage,
    incrementProfileViews: usersSocial.incrementProfileViews,
    getTotalProjectLikes: usersSocial.getTotalProjectLikes,

    // Operaciones de Autenticación
    updateUserEmail: usersAuth.updateUserEmail,
    updateUserPassword: usersAuth.updateUserPassword,
    deleteUserAccount: usersAuth.deleteUserAccount,
    sendVerificationEmail: usersAuth.sendVerificationEmail,
    resetPassword: usersAuth.resetPassword
};

// Re-exportar sub-módulos y tipos
export { usersProfile } from './profile';
export { usersSocial } from './social';
export { usersAuth } from './auth';
export type { UserProfile } from './profile';

