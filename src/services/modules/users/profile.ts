/**
 * Operaciones de Perfil de Usuario
 * 
 * Módulo que maneja las operaciones CRUD para perfiles de usuario.
 * Incluye búsqueda por ID, username y nombre, además de listeners en tiempo real.
 * 
 * @module services/users/profile
 */
import {
    collection,
    query,
    getDocs,
    getDoc,
    doc,
    setDoc,
    where,
    limit,
    updateDoc,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { User } from '../../../types';

export type UserProfile = User | null;

/**
 * Función recursiva para eliminar valores undefined de objetos.
 * Necesario para Firestore que no acepta undefined.
 */
const sanitizeData = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
        return obj.map(v => sanitizeData(v)).filter(v => v !== undefined);
    }
    if (obj !== null && typeof obj === 'object') {
        return Object.entries(obj as Record<string, unknown>).reduce((acc, [key, value]) => {
            const sanitizedValue = sanitizeData(value);
            if (sanitizedValue !== undefined) {
                acc[key] = sanitizedValue;
            }
            return acc;
        }, {} as Record<string, unknown>);
    }
    return obj;
};

export const usersProfile = {
    /**
     * Obtiene perfil de usuario por ID.
     * 
     * @param userId - ID del usuario
     * @returns Perfil del usuario o null si no existe
     */
    getUserProfile: async (userId: string): Promise<UserProfile> => {
        try {
            if (!userId) return null;
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as User;
            }
            return null;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    /**
     * Actualiza el perfil de un usuario.
     * 
     * Sanitiza los datos automáticamente para eliminar valores undefined.
     * 
     * @param userId - ID del usuario
     * @param data - Datos parciales a actualizar
     */
    updateUserProfile: async (userId: string, data: Partial<User>): Promise<void> => {
        try {
            const userRef = doc(db, 'users', userId);
            const sanitizedData = sanitizeData(data);
            await updateDoc(userRef, sanitizedData);
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },

    /**
     * Asegura que un perfil de usuario existe en Firestore.
     * 
     * Si no existe, crea uno nuevo con valores por defecto.
     * Ideal para Google Auth o inicialización desde App.tsx.
     * 
     * @param user - Objeto de usuario de Firebase Auth
     * @param additionalData - Datos adicionales para el perfil
     * @returns Perfil existente o recién creado
     */
    initializeUserProfile: async (user: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null }, additionalData: Partial<User> = {}): Promise<UserProfile> => {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return { id: userSnap.id, ...userSnap.data() } as User;
            }

            const newUser: Record<string, any> = {
                name: additionalData.name || user.displayName || 'Usuario',
                email: user.email || '',
                avatar: additionalData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}`,
                role: 'Creative Member',
                location: 'Latam',
                firstName: additionalData.firstName || '',
                lastName: additionalData.lastName || '',
                country: additionalData.country || '',
                city: additionalData.city || '',
                isProfileComplete: false,
                createdAt: new Date().toISOString(),
                ...additionalData
            };

            Object.keys(newUser).forEach(key => newUser[key] === undefined && delete newUser[key]);

            await setDoc(userRef, newUser);
            return { id: user.uid, uid: user.uid, ...newUser } as User;
        } catch (error) {
            console.error("Error initializing user profile:", error);
            throw error;
        }
    },

    /**
     * Obtiene perfil de usuario por username.
     * 
     * @param username - Username a buscar
     * @returns Perfil o null si no existe
     */
    getUserProfileByUsername: async (username: string) => {
        try {
            if (!username) return null;
            const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile by username:', error);
            return null;
        }
    },

    /**
     * Verifica si un username está disponible.
     * 
     * @param username - Username a verificar
     * @returns true si está disponible, false si ya existe
     */
    checkUsernameAvailability: async (username: string): Promise<boolean> => {
        try {
            if (!username) return false;
            const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
            const querySnapshot = await getDocs(q);
            return querySnapshot.empty;
        } catch (error) {
            console.error("Error checking username availability:", error);
            return false;
        }
    },

    /**
     * Listener en tiempo real para perfil de usuario por ID.
     * 
     * @param userId - ID del usuario
     * @param callback - Función que recibe el perfil actualizado
     * @returns Función para cancelar la suscripción
     */
    listenToUserProfile: (userId: string, callback: (user: UserProfile) => void) => {
        if (!userId) return () => { };
        const docRef = doc(db, 'users', userId);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({ id: docSnap.id, ...docSnap.data() } as User);
            } else {
                callback(null);
            }
        });
    },

    /**
     * Listener en tiempo real para perfil de usuario por username.
     * 
     * @param username - Username del usuario
     * @param callback - Función que recibe el perfil actualizado
     * @returns Función para cancelar la suscripción
     */
    listenToUserProfileByUsername: (username: string, callback: (user: UserProfile) => void) => {
        if (!username) return () => { };
        const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
        return onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                callback({ id: doc.id, ...doc.data() } as User);
            } else {
                callback(null);
            }
        });
    },

    /**
     * Obtiene perfil de usuario por nombre.
     * 
     * Útil para compatibilidad con datos legacy.
     * 
     * @param name - Nombre del usuario
     * @returns Perfil o null si no existe
     */
    getUserProfileByName: async (name: string) => {
        try {
            if (!name || name === 'Unknown User') return null;
            const q = query(collection(db, 'users'), where('name', '==', name), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile by name:', error);
            return null;
        }
    },

    /**
     * Obtiene todos los usuarios.
     * 
     * @returns Array de todos los usuarios
     */
    getAllUsers: async (): Promise<User[]> => {
        try {
            const q = query(collection(db, 'users'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    },

    /**
     * Obtiene el directorio de artistas (placeholder).
     * 
     * @returns Array vacío (por implementar)
     */
    getArtistDirectory: async (): Promise<User[]> => {
        return [];
    }
};
