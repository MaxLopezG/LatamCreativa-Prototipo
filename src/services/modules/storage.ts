import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const storage = getStorage();

/**
 * Opciones para subida de imágenes
 */
interface UploadOptions {
    /** Tamaño máximo en MB */
    maxSizeMB?: number;
    /** Si se debe comprimir la imagen */
    compress?: boolean;
    /** Calidad de compresión (0-1) */
    quality?: number;
}

/**
 * Servicio de Storage
 * 
 * Maneja subida, eliminación y compresión de archivos en Firebase Storage.
 * 
 * @module services/storage
 */
export const storageService = {
    /**
     * Elimina una imagen de Firebase Storage usando su URL de descarga.
     * 
     * @param url - URL de descarga del archivo a eliminar
     * @returns true si la eliminación fue exitosa, false si no
     */
    deleteFromUrl: async (url: string): Promise<boolean> => {
        if (!url || !url.includes('firebase')) {
            return false; // No es URL de Firebase Storage o está vacía
        }

        try {
            // Extraer el path de la URL de Firebase Storage
            const decodedUrl = decodeURIComponent(url);
            const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);

            if (!pathMatch || !pathMatch[1]) {
                console.warn('No se pudo extraer path de la URL:', url);
                return false;
            }

            const filePath = pathMatch[1];
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
            return true;
        } catch (error) {
            // El archivo puede no existir o ya estar eliminado - no es error crítico
            console.warn('No se pudo eliminar imagen antigua:', error);
            return false;
        }
    },

    /**
     * Sube una imagen a Firebase Storage con validación y compresión opcional.
     * 
     * @param file - Archivo a subir
     * @param path - Ruta en storage
     * @param options - Configuración para la subida
     * @returns URL pública de descarga del archivo subido
     */
    uploadImage: async (file: File, path: string, options: UploadOptions = {}): Promise<string> => {
        const { maxSizeMB = 5, compress = true, quality = 0.8 } = options;

        if (file.size > maxSizeMB * 1024 * 1024) {
            throw new Error(`El archivo excede el límite de ${maxSizeMB}MB.`);
        }

        let fileToUpload = file;

        if (compress && file.type.startsWith('image/')) {
            try {
                fileToUpload = await imageCompression(file, {
                    maxSizeMB: 2, // Always try to compress to a reasonable web size
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: quality,
                });
            } catch (compressionError) {
                console.warn('No se pudo comprimir la imagen, se subirá el original:', compressionError);
            }
        }

        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, fileToUpload);
        return getDownloadURL(storageRef);
    },
};