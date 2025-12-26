/**
 * Operaciones de Autenticación de Usuario
 * 
 * Módulo que maneja operaciones de cuenta: cambio de email, contraseña y eliminación.
 * Requiere re-autenticación para operaciones sensibles según las reglas de Firebase.
 * 
 * @module services/users/auth
 */
import {
    updateEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    deleteUser,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';

export const usersAuth = {
    /**
     * Re-autentica al usuario actual con su contraseña.
     * Requerido por Firebase antes de operaciones sensibles como cambio de email/password o eliminación.
     * 
     * @param password - Contraseña actual del usuario
     * @throws Error si la re-autenticación falla
     */
    reauthenticate: async (password: string): Promise<void> => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            throw new Error('No hay usuario autenticado');
        }

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
    },

    /**
     * Actualiza el email del usuario.
     * 
     * Actualiza tanto en Firebase Auth como en Firestore.
     * Requiere re-autenticación previa si la sesión es antigua.
     * 
     * @param newEmail - Nuevo correo electrónico
     * @param currentPassword - Contraseña para re-autenticación
     * @throws Error si el email está en uso o la contraseña es incorrecta
     */
    updateUserEmail: async (newEmail: string, currentPassword: string): Promise<void> => {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No hay usuario autenticado');
        }

        // Re-autenticar primero
        await usersAuth.reauthenticate(currentPassword);

        // Actualizar en Firebase Auth
        await updateEmail(user, newEmail);

        // Actualizar en Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { email: newEmail });

        // Enviar email de verificación al nuevo correo
        await sendEmailVerification(user);
    },

    /**
     * Actualiza la contraseña del usuario.
     * 
     * @param currentPassword - Contraseña actual para re-autenticación
     * @param newPassword - Nueva contraseña (mínimo 6 caracteres)
     * @throws Error si la contraseña actual es incorrecta o la nueva es muy débil
     */
    updateUserPassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No hay usuario autenticado');
        }

        if (newPassword.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }

        if (!/[A-Z]/.test(newPassword)) {
            throw new Error('La contraseña debe contener al menos una mayúscula');
        }

        if (!/[0-9]/.test(newPassword)) {
            throw new Error('La contraseña debe contener al menos un número');
        }

        if (!/[^A-Za-z0-9]/.test(newPassword)) {
            throw new Error('La contraseña debe contener al menos un símbolo');
        }

        // Re-autenticar primero
        await usersAuth.reauthenticate(currentPassword);

        // Actualizar contraseña
        await updatePassword(user, newPassword);
    },

    /**
     * Elimina la cuenta del usuario y TODO su contenido.
     * 
     * Elimina en orden:
     * 1. Todos los proyectos del usuario (incluyendo imágenes)
     * 2. Todos los artículos del usuario (incluyendo imágenes)
     * 3. Todas las colecciones del usuario
     * 4. Carpeta completa del usuario en Storage
     * 5. Documento de usuario de Firestore
     * 6. Usuario de Firebase Auth
     * 
     * @param password - Contraseña para confirmación
     * @throws Error si la contraseña es incorrecta
     */
    deleteUserAccount: async (password: string): Promise<void> => {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No hay usuario autenticado');
        }

        // Re-autenticar primero
        await usersAuth.reauthenticate(password);

        const userId = user.uid;

        try {
            // 1. Eliminar todos los proyectos del usuario
            const { collection, getDocs, query, where, writeBatch } = await import('firebase/firestore');
            const { ref, listAll, deleteObject } = await import('firebase/storage');
            const { storage } = await import('../../../lib/firebase');

            const projectsQuery = query(collection(db, 'projects'), where('authorId', '==', userId));
            const projectsSnapshot = await getDocs(projectsQuery);

            for (const projectDoc of projectsSnapshot.docs) {
                const projectId = projectDoc.id;
                // Eliminar imágenes del proyecto
                try {
                    const projectStorageRef = ref(storage, `users/${userId}/projects/${projectId}`);
                    const projectFiles = await listAll(projectStorageRef);
                    await Promise.all(projectFiles.items.map(item => deleteObject(item)));
                    // Eliminar subcarpetas (galería)
                    for (const prefix of projectFiles.prefixes) {
                        const subFiles = await listAll(prefix);
                        await Promise.all(subFiles.items.map(item => deleteObject(item)));
                    }
                } catch (storageError) {
                    console.warn(`Could not delete project storage for ${projectId}:`, storageError);
                }
            }

            // Eliminar documentos de proyectos en batch
            const projectsBatch = writeBatch(db);
            projectsSnapshot.docs.forEach(doc => projectsBatch.delete(doc.ref));
            if (projectsSnapshot.docs.length > 0) {
                await projectsBatch.commit();
            }

            // 2. Eliminar todos los artículos del usuario
            const articlesQuery = query(collection(db, 'articles'), where('authorId', '==', userId));
            const articlesSnapshot = await getDocs(articlesQuery);

            for (const articleDoc of articlesSnapshot.docs) {
                const articleId = articleDoc.id;
                const articleData = articleDoc.data();
                // Eliminar imagen de portada del artículo
                if (articleData.coverImage) {
                    try {
                        const imageRef = ref(storage, articleData.coverImage);
                        await deleteObject(imageRef);
                    } catch (storageError) {
                        console.warn(`Could not delete article image for ${articleId}:`, storageError);
                    }
                }
            }

            // Eliminar documentos de artículos en batch
            const articlesBatch = writeBatch(db);
            articlesSnapshot.docs.forEach(doc => articlesBatch.delete(doc.ref));
            if (articlesSnapshot.docs.length > 0) {
                await articlesBatch.commit();
            }

            // 3. Eliminar todas las colecciones del usuario
            const collectionsQuery = query(collection(db, 'collections'), where('userId', '==', userId));
            const collectionsSnapshot = await getDocs(collectionsQuery);

            const collectionsBatch = writeBatch(db);
            collectionsSnapshot.docs.forEach(doc => collectionsBatch.delete(doc.ref));
            if (collectionsSnapshot.docs.length > 0) {
                await collectionsBatch.commit();
            }

            // 4. Eliminar carpeta completa del usuario en Storage
            try {
                const userStorageRef = ref(storage, `users/${userId}`);
                const allFiles = await listAll(userStorageRef);
                await Promise.all(allFiles.items.map(item => deleteObject(item)));
                // Eliminar subcarpetas
                for (const prefix of allFiles.prefixes) {
                    const deleteFolder = async (folderRef: any) => {
                        const folderFiles = await listAll(folderRef);
                        await Promise.all(folderFiles.items.map(item => deleteObject(item)));
                        for (const subPrefix of folderFiles.prefixes) {
                            await deleteFolder(subPrefix);
                        }
                    };
                    await deleteFolder(prefix);
                }
            } catch (storageError) {
                console.warn('Could not fully clean user storage:', storageError);
            }

            // 5. Eliminar documento de usuario de Firestore
            const userRef = doc(db, 'users', userId);
            await deleteDoc(userRef);

            // 6. Eliminar usuario de Firebase Auth
            await deleteUser(user);

        } catch (error) {
            console.error('Error during account deletion:', error);
            throw new Error('Error al eliminar la cuenta. Algunos datos pueden no haberse eliminado completamente.');
        }
    },

    /**
     * Envía un email de verificación al usuario actual.
     */
    sendVerificationEmail: async (): Promise<void> => {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No hay usuario autenticado');
        }
        await sendEmailVerification(user);
    },

    /**
     * Envía un email de recuperación de contraseña.
     * 
     * @param email - Email del usuario que quiere recuperar su contraseña
     * @throws Error si el email no está registrado
     */
    resetPassword: async (email: string): Promise<void> => {
        if (!email || !email.trim()) {
            throw new Error('El email es requerido');
        }
        await sendPasswordResetEmail(auth, email.trim());
    }
};
