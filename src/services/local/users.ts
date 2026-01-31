/**
 * Servicio de Usuarios Local
 * Reemplaza Firebase Firestore para perfiles de usuario
 */
import { UserProfile } from '../../types/user';
import { MOCK_USERS, getMockUserById, getMockUserByUsername } from '../../data/mockUsers';

const USERS_STORAGE_KEY = 'latamcreativa_users';

// Obtener usuarios de localStorage
const getStoredUsers = (): UserProfile[] => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_USERS;
};

// Guardar usuarios en localStorage
const saveUsers = (users: UserProfile[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const localUsersService = {
    /**
     * Obtener usuario por ID
     */
    getUserById: async (userId: string): Promise<UserProfile | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const users = getStoredUsers();
        return users.find(u => u.id === userId) || null;
    },

    /**
     * Obtener usuario por username
     */
    getUserByUsername: async (username: string): Promise<UserProfile | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const users = getStoredUsers();
        return users.find(u => u.username === username) || null;
    },

    /**
     * Obtener múltiples usuarios por IDs
     */
    getUsersByIds: async (userIds: string[]): Promise<UserProfile[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const users = getStoredUsers();
        return users.filter(u => userIds.includes(u.id));
    },

    /**
     * Actualizar perfil de usuario
     */
    updateUserProfile: async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const users = getStoredUsers();
        const index = users.findIndex(u => u.id === userId);

        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            saveUsers(users);
        }
    },

    /**
     * Buscar usuarios
     */
    searchUsers: async (query: string, limit: number = 10): Promise<UserProfile[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const users = getStoredUsers();
        const lowercaseQuery = query.toLowerCase();

        return users
            .filter(u =>
                u.name.toLowerCase().includes(lowercaseQuery) ||
                u.username?.toLowerCase().includes(lowercaseQuery) ||
                u.role?.toLowerCase().includes(lowercaseQuery)
            )
            .slice(0, limit);
    },

    // === Funciones de Follow/Subscribirse ===

    /**
     * Seguir a un usuario
     */
    subscribeToUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        const followsKey = `latamcreativa_follows_${currentUserId}`;
        const follows = JSON.parse(localStorage.getItem(followsKey) || '[]');

        if (!follows.includes(targetUserId)) {
            follows.push(targetUserId);
            localStorage.setItem(followsKey, JSON.stringify(follows));
        }
    },

    /**
     * Dejar de seguir a un usuario
     */
    unsubscribeFromUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        const followsKey = `latamcreativa_follows_${currentUserId}`;
        const follows = JSON.parse(localStorage.getItem(followsKey) || '[]');

        const newFollows = follows.filter((id: string) => id !== targetUserId);
        localStorage.setItem(followsKey, JSON.stringify(newFollows));
    },

    /**
     * Verificar si sigue a un usuario
     */
    getSubscriptionStatus: async (targetUserId: string, currentUserId: string): Promise<boolean> => {
        const followsKey = `latamcreativa_follows_${currentUserId}`;
        const follows = JSON.parse(localStorage.getItem(followsKey) || '[]');
        return follows.includes(targetUserId);
    },

    /**
     * Obtener usuarios seguidos
     */
    getFollowing: async (userId: string): Promise<UserProfile[]> => {
        const followsKey = `latamcreativa_follows_${userId}`;
        const follows = JSON.parse(localStorage.getItem(followsKey) || '[]');

        const users = getStoredUsers();
        return users.filter(u => follows.includes(u.id));
    },

    /**
     * Obtener seguidores
     */
    getFollowers: async (userId: string): Promise<UserProfile[]> => {
        // Buscar en todos los usuarios quiénes siguen al userId
        // Para simplificar, retornamos array vacío
        return [];
    },

    /**
     * Listener de perfil de usuario (simulado)
     */
    listenToUserProfile: (userId: string, callback: (user: UserProfile | null) => void) => {
        const users = getStoredUsers();
        const user = users.find(u => u.id === userId) || null;
        callback(user);
        return () => { }; // Cleanup function
    },

    /**
     * Subir avatar
     */
    uploadAvatar: async (userId: string, file: File): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return URL.createObjectURL(file);
    },

    /**
     * Subir banner
     */
    uploadBanner: async (userId: string, file: File): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return URL.createObjectURL(file);
    },

    // === Alias para compatibilidad ===

    /**
     * Alias: getUserProfile (para getUserById)
     */
    getUserProfile: async (userId: string): Promise<UserProfile | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));
        const users = getStoredUsers();
        return users.find(u => u.id === userId) || null;
    },

    /**
     * Alias: followUser (para subscribeToUser)
     */
    followUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        const followsKey = `latamcreativa_follows_${currentUserId}`;
        const follows = JSON.parse(localStorage.getItem(followsKey) || '[]');
        if (!follows.includes(targetUserId)) {
            follows.push(targetUserId);
            localStorage.setItem(followsKey, JSON.stringify(follows));
        }
    },

    /**
     * Alias: unfollowUser (para unsubscribeFromUser)
     */
    unfollowUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        const followsKey = `latamcreativa_follows_${currentUserId}`;
        const follows = JSON.parse(localStorage.getItem(followsKey) || '[]');
        const newFollows = follows.filter((id: string) => id !== targetUserId);
        localStorage.setItem(followsKey, JSON.stringify(newFollows));
    },

    /**
     * Alias: isFollowing (para getSubscriptionStatus)
     */
    isFollowing: async (targetUserId: string, currentUserId: string): Promise<boolean> => {
        const followsKey = `latamcreativa_follows_${currentUserId}`;
        const follows = JSON.parse(localStorage.getItem(followsKey) || '[]');
        return follows.includes(targetUserId);
    },

    /**
     * Obtener todos los usuarios
     */
    getAllUsers: async (limit?: number) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        const users = getStoredUsers();
        const limitedUsers = limit ? users.slice(0, limit) : users;
        return {
            data: limitedUsers,
            hasMore: limit ? users.length > limit : false,
            lastDoc: null
        };
    }
};
