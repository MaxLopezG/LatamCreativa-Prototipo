/**
 * Servicio de Autenticación Local
 * Reemplaza Firebase Auth con localStorage
 */
import { DEMO_USER, DEMO_CREDENTIALS, MOCK_USERS, getMockUserByEmail } from '../../data/mockUsers';
import { UserProfile } from '../../types/user';

const AUTH_STORAGE_KEY = 'latamcreativa_auth';
const USERS_STORAGE_KEY = 'latamcreativa_users';

// Inicializar usuarios en localStorage si no existen
const initializeUsers = () => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
    }
};

// Obtener usuarios de localStorage
const getStoredUsers = (): UserProfile[] => {
    initializeUsers();
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
};

// Guardar usuarios en localStorage
const saveUsers = (users: UserProfile[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const localAuthService = {
    /**
     * Login con email y contraseña
     */
    login: async (email: string, password: string): Promise<UserProfile> => {
        // Simular delay de red mínimo
        await new Promise(resolve => setTimeout(resolve, 50));

        // Verificar credenciales demo
        if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
            return DEMO_USER;
        }

        // Buscar en usuarios registrados localmente
        const users = getStoredUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Para usuarios registrados localmente, aceptar cualquier contraseña (modo desarrollo)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    /**
     * Login con Google (simulado)
     */
    loginWithGoogle: async (): Promise<UserProfile> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        // Simular login con cuenta demo
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
        return DEMO_USER;
    },

    /**
     * Registro de nuevo usuario
     */
    register: async (email: string, password: string, name: string): Promise<UserProfile> => {
        await new Promise(resolve => setTimeout(resolve, 50));

        const users = getStoredUsers();

        // Verificar si el email ya existe
        if (users.find(u => u.email === email)) {
            throw new Error('Este email ya está registrado');
        }

        // Crear nuevo usuario
        const newUser: UserProfile = {
            id: `user-${Date.now()}`,
            name,
            username: name.toLowerCase().replace(/\s+/g, ''),
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            role: 'Artista',
            headline: '',
            bio: '',
            location: '',
            isVerified: false,
            isPro: false,
            availableForWork: false,
            skills: [],
            stats: {
                followers: 0,
                following: 0,
                projects: 0,
                articles: 0,
                views: 0,
                likes: 0
            },
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
        };

        // Guardar usuario
        users.push(newUser);
        saveUsers(users);

        // Auto login
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        return newUser;
    },

    /**
     * Cerrar sesión
     */
    logout: async (): Promise<void> => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    },

    /**
     * Obtener usuario actual de la sesión
     */
    getCurrentUser: (): UserProfile | null => {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    /**
     * Verificar si hay sesión activa
     */
    isAuthenticated: (): boolean => {
        return localStorage.getItem(AUTH_STORAGE_KEY) !== null;
    },

    /**
     * Actualizar perfil de usuario
     */
    updateProfile: async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
        await new Promise(resolve => setTimeout(resolve, 50));

        const users = getStoredUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        const updatedUser = { ...users[userIndex], ...updates };
        users[userIndex] = updatedUser;
        saveUsers(users);

        // Actualizar sesión si es el usuario actual
        const currentUser = localAuthService.getCurrentUser();
        if (currentUser?.id === userId) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
        }

        return updatedUser;
    },

    /**
     * Listener de cambios de autenticación (simulado)
     */
    onAuthStateChange: (callback: (user: UserProfile | null) => void): (() => void) => {
        // Llamar inmediatamente con el estado actual
        const currentUser = localAuthService.getCurrentUser();
        callback(currentUser);

        // Escuchar cambios en localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === AUTH_STORAGE_KEY) {
                const user = e.newValue ? JSON.parse(e.newValue) : null;
                callback(user);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Retornar función de cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }
};
