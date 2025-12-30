/**
 * Operaciones CRUD de Proyectos
 * 
 * Módulo que maneja las operaciones Create, Read, Update, Delete
 * para proyectos de portafolio almacenados en Firestore.
 * 
 * @module services/projects/crud
 */
import {
    collection,
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    writeBatch,
    increment,
    onSnapshot,
    startAfter,
    QueryDocumentSnapshot,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../lib/firebase';
import { storageService } from '../storage';
import { PortfolioItem } from '../../../types';
import { PaginatedResult } from '../utils';
import { generateUniqueSlug } from '../../../utils/slugUtils';

/** Tipo para items de galería en proyectos */
interface GalleryItem {
    type: 'image' | 'video' | 'youtube' | 'sketchfab';
    url: string;
    caption: string;
}

export const projectsCrud = {
    /**
     * Crea un nuevo proyecto con manejo robusto de transacciones.
     * 
     * Proceso:
     * 1. Sube la imagen de portada (si existe)
     * 2. Sube las imágenes de galería (si existen)
     * 3. Crea el documento del proyecto y actualiza estadísticas del usuario atómicamente
     * 
     * @param userId - ID del usuario que crea el proyecto
     * @param projectData - Datos parciales del proyecto (título, descripción, etc.)
     * @param files - Archivos a subir (portada y galería)
     * @param uploadOptions - Opciones de subida (tamaño máximo, metadatos, callback de progreso)
     * @returns Promise con el ID del proyecto creado
     * @throws Error si falla la creación
     */
    createProject: async (
        userId: string,
        projectData: Partial<PortfolioItem>,
        files: { cover?: File; gallery?: File[] },
        uploadOptions: {
            maxSizeMB: number;
            galleryMetadata?: { type: 'image' | 'video' | 'youtube' | 'sketchfab'; caption?: string; fileIndex?: number; url?: string }[];
            onProgress?: (progress: number) => void;
        }
    ): Promise<{ id: string; slug: string }> => {
        try {
            const totalOps = (files.cover ? 1 : 0) + (files.gallery?.length || 0) + 1;
            let completedOps = 0;
            const updateProgress = () => {
                completedOps++;
                if (uploadOptions.onProgress) uploadOptions.onProgress(Math.round((completedOps / totalOps) * 100));
            };

            const newProjectRef = doc(collection(db, 'projects'));
            const projectId = newProjectRef.id;

            // Upload Cover Image
            let coverUrl = '';
            if (files.cover) {
                const path = `users/${userId}/projects/${projectId}/cover.jpg`;
                coverUrl = await storageService.uploadImage(files.cover, path, uploadOptions);
                updateProgress();
            }

            // Upload Gallery Images
            const uploadedUrls: string[] = [];
            if (files.gallery && files.gallery.length > 0) {
                const uploadPromises = files.gallery.map(async (file, index) => {
                    const timestamp = Date.now();
                    const path = `users/${userId}/projects/${projectId}/gallery/${timestamp}_${index}.jpg`;
                    const url = await storageService.uploadImage(file, path, uploadOptions);
                    updateProgress();
                    return url;
                });
                uploadedUrls.push(...(await Promise.all(uploadPromises)));
            }

            // Prepare Gallery Objects
            let galleryObjects: GalleryItem[] = [];
            if (uploadOptions.galleryMetadata) {
                galleryObjects = uploadOptions.galleryMetadata.map(meta => {
                    if (meta.type === 'image' && meta.fileIndex !== undefined) {
                        return { type: 'image' as const, caption: meta.caption || '', url: uploadedUrls[meta.fileIndex] || '' };
                    } else if (meta.type === 'youtube' || meta.type === 'sketchfab') {
                        return { type: meta.type as 'youtube' | 'sketchfab', caption: meta.caption || '', url: meta.url || '' };
                    }
                    return null;
                }).filter(item => item !== null) as GalleryItem[];
            } else {
                galleryObjects = uploadedUrls.map(url => ({ type: 'image' as const, url, caption: '' }));
            }

            const legacyImages = galleryObjects.filter(item => item.type === 'image').map(item => item.url);

            // Fetch author availability
            const authorDocRef = doc(db, 'users', userId);
            const authorDocSnap = await getDoc(authorDocRef);
            const isAuthorAvailable = authorDocSnap.data()?.availableForWork || false;

            const finalData = {
                ...projectData,
                domain: projectData.domain || 'creative',
                id: projectId,
                slug: generateUniqueSlug(projectData.title || 'proyecto'),
                authorId: userId,
                image: coverUrl || projectData.image || '',
                images: legacyImages.length > 0 ? legacyImages : (projectData.images || []),
                gallery: galleryObjects,
                availableForWork: isAuthorAvailable,
                createdAt: new Date().toISOString(),
                views: 0,
                likes: 0,
                artistUsername: (projectData as any).artistUsername || '',
                status: projectData.status || 'published',
                scheduledAt: projectData.scheduledAt || null,
                stats: { viewCount: 0, likeCount: 0 }
            };

            Object.keys(finalData).forEach(key => (finalData as any)[key] === undefined && delete (finalData as any)[key]);

            const batch = writeBatch(db);
            batch.set(newProjectRef, finalData);

            const userRef = doc(db, 'users', userId);
            batch.update(userRef, { 'stats.projects': increment(1) });

            await batch.commit();
            updateProgress();

            return { id: projectId, slug: finalData.slug };
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    },

    /**
     * Actualiza un proyecto existente.
     * 
     * Maneja la subida de nuevos archivos y los combina con el contenido existente.
     * Elimina automáticamente las imágenes antiguas que ya no se usan.
     * 
     * @param userId - ID del usuario propietario
     * @param projectId - ID del proyecto a actualizar
     * @param projectData - Datos a actualizar
     * @param files - Nuevos archivos a subir
     * @param uploadOptions - Opciones de subida
     */
    updateProject: async (
        userId: string,
        projectId: string,
        projectData: Partial<PortfolioItem>,
        files: { cover?: File; gallery?: File[] },
        uploadOptions: {
            maxSizeMB: number;
            galleryMetadata?: { type: 'image' | 'video' | 'youtube' | 'sketchfab'; caption?: string; fileIndex?: number; url?: string }[];
            onProgress?: (progress: number) => void;
        }
    ): Promise<void> => {
        try {
            const totalOps = (files.cover ? 1 : 0) + (files.gallery?.length || 0) + 1;
            let completedOps = 0;
            const updateProgress = () => {
                completedOps++;
                if (uploadOptions.onProgress) uploadOptions.onProgress(Math.round((completedOps / totalOps) * 100));
            };

            const projectRef = doc(db, 'projects', projectId);
            const existingDoc = await getDoc(projectRef);
            const existingData = existingDoc.data();
            const oldCoverUrl = existingData?.image || '';
            const oldGalleryUrls: string[] = existingData?.images || [];

            // Upload Cover Image
            let coverUrl = projectData.image;
            if (files.cover) {
                if (oldCoverUrl) await storageService.deleteFromUrl(oldCoverUrl);
                const path = `users/${userId}/projects/${projectId}/cover_${Date.now()}.jpg`;
                coverUrl = await storageService.uploadImage(files.cover, path, uploadOptions);
                updateProgress();
            }

            // Upload New Gallery Images
            const uploadedUrls: string[] = [];
            if (files.gallery && files.gallery.length > 0) {
                const uploadPromises = files.gallery.map(async (file, index) => {
                    const timestamp = Date.now();
                    const path = `users/${userId}/projects/${projectId}/gallery/${timestamp}_${index}.jpg`;
                    const url = await storageService.uploadImage(file, path, uploadOptions);
                    updateProgress();
                    return url;
                });
                uploadedUrls.push(...(await Promise.all(uploadPromises)));
            }

            // Construct Gallery Objects
            let galleryObjects: GalleryItem[] = [];
            if (uploadOptions.galleryMetadata) {
                galleryObjects = uploadOptions.galleryMetadata.map(meta => {
                    if (meta.type === 'image') {
                        if (meta.fileIndex !== undefined) {
                            return { type: 'image' as const, caption: meta.caption || '', url: uploadedUrls[meta.fileIndex] || '' };
                        } else if (meta.url) {
                            return { type: 'image' as const, caption: meta.caption || '', url: meta.url };
                        }
                    } else if (meta.type === 'youtube' || meta.type === 'sketchfab') {
                        return { type: meta.type as 'youtube' | 'sketchfab', caption: meta.caption || '', url: meta.url || '' };
                    }
                    return null;
                }).filter(item => item !== null) as GalleryItem[];
            }

            // Cleanup removed gallery images
            const newGalleryUrls = galleryObjects.filter(item => item.type === 'image').map(item => item.url);
            const removedGalleryUrls = oldGalleryUrls.filter(url => !newGalleryUrls.includes(url));
            if (removedGalleryUrls.length > 0) {
                Promise.all(removedGalleryUrls.map(url => storageService.deleteFromUrl(url)))
                    .catch(err => console.warn('Some gallery images could not be deleted:', err));
            }

            const authorDocRef = doc(db, 'users', userId);
            const authorDocSnap = await getDoc(authorDocRef);
            const isAuthorAvailable = authorDocSnap.data()?.availableForWork || false;

            const finalData = {
                ...projectData,
                image: coverUrl,
                availableForWork: isAuthorAvailable,
                images: galleryObjects.filter(item => item.type === 'image').map(item => item.url),
                gallery: galleryObjects,
                updatedAt: new Date().toISOString()
            };

            Object.keys(finalData).forEach(key => (finalData as any)[key] === undefined && delete (finalData as any)[key]);

            await updateDoc(projectRef, finalData);
            updateProgress();
        } catch (error) {
            console.error("Error updating project:", error);
            throw error;
        }
    },

    /**
     * Elimina un proyecto y actualiza estadísticas del usuario atómicamente.
     * 
     * Proceso:
     * 1. Elimina todos los archivos del Storage (portada y galería)
     * 2. Elimina el documento del proyecto
     * 3. Decrementa el contador de proyectos del usuario
     * 
     * @param userId - ID del usuario propietario
     * @param projectId - ID del proyecto a eliminar
     */
    deleteProject: async (userId: string, projectId: string): Promise<void> => {
        try {
            const deleteFolder = async (path: string) => {
                const folderRef = ref(storage, path);
                try {
                    const list = await listAll(folderRef);
                    await Promise.all(list.items.map(item => deleteObject(item)));
                    await Promise.all(list.prefixes.map(prefix => deleteFolder(prefix.fullPath)));
                } catch (err) {
                    console.warn(`Storage cleanup warning for ${path}:`, err);
                }
            };
            await deleteFolder(`users/${userId}/projects/${projectId}`);

            const batch = writeBatch(db);
            const projectRef = doc(db, 'projects', projectId);
            batch.delete(projectRef);

            const userRef = doc(db, 'users', userId);
            batch.update(userRef, { 'stats.projects': increment(-1) });

            await batch.commit();
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    },

    /**
     * Obtiene proyectos paginados para el feed global.
     * 
     * Usa paginación basada en cursor para mejor rendimiento con grandes datasets.
     * 
     * @param lastDoc - Último documento de la página anterior (null para la primera página)
     * @param pageSize - Cantidad de proyectos por página
     * @returns Resultado paginado con datos, cursor y flag hasMore
     */
    getProjects: async (lastDoc: QueryDocumentSnapshot<DocumentData> | null = null, pageSize: number = 20): Promise<PaginatedResult<PortfolioItem>> => {
        try {
            let q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(pageSize));

            if (lastDoc) {
                q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
                hasMore: snapshot.docs.length === pageSize
            };
        } catch (error) {
            console.error("Error fetching paginated projects:", error);
            throw error;
        }
    },

    /**
     * Obtiene todos los proyectos de un usuario específico.
     * 
     * @param userId - ID del usuario (authorId)
     * @param limitCount - Límite opcional de resultados
     * @returns Array de proyectos ordenados por fecha de creación
     */
    getUserProjects: async (userId: string, limitCount?: number): Promise<PortfolioItem[]> => {
        try {
            const constraints: QueryConstraint[] = [where('authorId', '==', userId), orderBy('createdAt', 'desc')];
            if (limitCount) constraints.push(limit(limitCount));

            const q = query(collection(db, 'projects'), ...constraints);
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
        } catch (error) {
            console.error("Error fetching user projects:", error);
            return [];
        }
    },

    /**
     * Obtiene un proyecto por su ID.
     * 
     * @param projectId - ID del proyecto
     * @returns El proyecto encontrado o null si no existe
     */
    getProject: async (projectId: string): Promise<PortfolioItem | null> => {
        try {
            const docRef = doc(db, 'projects', projectId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as PortfolioItem;
            }
            return null;
        } catch (error) {
            console.error("Error fetching project:", error);
            return null;
        }
    },

    /**
     * Obtiene un proyecto por su slug (URL amigable).
     * Si no encuentra por slug, intenta buscar por ID (backward compatibility).
     * 
     * @param slugOrId - Slug del proyecto o ID de Firebase
     * @returns El proyecto encontrado o null si no existe
     */
    getProjectBySlug: async (slugOrId: string): Promise<PortfolioItem | null> => {
        try {
            // First try to find by slug
            const slugQuery = query(collection(db, 'projects'), where('slug', '==', slugOrId), limit(1));
            const slugSnapshot = await getDocs(slugQuery);

            if (!slugSnapshot.empty) {
                const doc = slugSnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as PortfolioItem;
            }

            // Fallback: try to find by ID (for old projects without slug)
            const docRef = doc(db, 'projects', slugOrId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as PortfolioItem;
            }

            return null;
        } catch (error) {
            console.error("Error fetching project by slug:", error);
            return null;
        }
    },

    /**
     * Obtiene múltiples proyectos por sus IDs.
     * 
     * Maneja el límite de 10 items de Firestore para queries 'in'
     * dividiendo la consulta en chunks.
     * 
     * @param ids - Array de IDs de proyectos
     * @returns Array de proyectos encontrados
     */
    getProjectsByIds: async (ids: string[]): Promise<PortfolioItem[]> => {
        if (!ids || ids.length === 0) return [];

        const chunks = [];
        for (let i = 0; i < ids.length; i += 10) {
            chunks.push(ids.slice(i, i + 10));
        }

        try {
            const { documentId } = await import('firebase/firestore');
            const results = await Promise.all(chunks.map(async chunk => {
                const q = query(collection(db, 'projects'), where(documentId(), 'in', chunk));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem));
            }));

            return results.flat();
        } catch (error) {
            console.error("Error fetching projects by IDs:", error);
            return [];
        }
    },

    /**
     * Obtiene los proyectos más recientes para el feed global.
     * 
     * @param limitCount - Cantidad máxima de proyectos (default: 20)
     * @returns Array de proyectos ordenados por fecha descendente
     */
    getRecentProjects: async (limitCount: number = 20): Promise<PortfolioItem[]> => {
        try {
            const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(limitCount));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
        } catch (error) {
            console.error("Error fetching recent projects:", error);
            return [];
        }
    },

    /**
     * Listener en tiempo real para los proyectos de un usuario.
     * 
     * Se actualiza automáticamente cuando hay cambios en Firestore.
     * 
     * @param userId - ID del usuario
     * @param callback - Función que recibe el array actualizado de proyectos
     * @returns Función para cancelar la suscripción
     */
    listenToUserProjects: (userId: string, callback: (projects: PortfolioItem[]) => void) => {
        const q = query(collection(db, 'projects'), where('authorId', '==', userId), orderBy('createdAt', 'desc'));

        return onSnapshot(q, (snapshot) => {
            const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
            callback(projects);
        });
    }
};
