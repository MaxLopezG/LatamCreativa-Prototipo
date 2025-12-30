/**
 * Factory de Servicios de Likes para Contenido
 * 
 * Genera funciones de likes parametrizadas por tipo de colección.
 * 
 * @module services/shared/likes
 */
import {
    doc,
    getDoc
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Tipos de contenido soportados
type ContentType = 'articles' | 'projects';

/**
 * Factory que crea funciones comunes de likes para un tipo de contenido.
 * 
 * Nota: toggleLike se mantiene en cada módulo porque tiene lógica específica
 * (projects usa batch, articles no; diferentes campos de stats).
 * 
 * @param contentType - 'articles' o 'projects'
 */
export const createLikesService = (contentType: ContentType) => ({
    /**
     * Verifica si un usuario ha dado like a un item.
     */
    getLikeStatus: async (itemId: string, userId: string): Promise<boolean> => {
        try {
            const likeRef = doc(db, contentType, itemId, 'likes', userId);
            const snap = await getDoc(likeRef);
            return snap.exists();
        } catch (error) {
            console.error(`Error checking like status in ${contentType}:`, error);
            return false;
        }
    }
});

// Pre-crear servicios para uso directo
export const articlesLikesShared = createLikesService('articles');
export const projectsLikesShared = createLikesService('projects');
