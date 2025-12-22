import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const storage = getStorage();

interface UploadOptions {
    maxSizeMB?: number;
    compress?: boolean;
    quality?: number;
}

export const storageService = {
    /**
     * Deletes an image from Firebase Storage using its download URL.
     * @param url The download URL of the file to delete.
     * @returns true if deletion was successful, false otherwise.
     */
    deleteFromUrl: async (url: string): Promise<boolean> => {
        if (!url || !url.includes('firebase')) {
            return false; // Not a Firebase Storage URL or empty
        }
        
        try {
            // Extract the path from the Firebase Storage URL
            const decodedUrl = decodeURIComponent(url);
            const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
            
            if (!pathMatch || !pathMatch[1]) {
                console.warn('Could not extract path from URL:', url);
                return false;
            }
            
            const filePath = pathMatch[1];
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
            return true;
        } catch (error) {
            // File might not exist or already deleted - not a critical error
            console.warn('Could not delete old image:', error);
            return false;
        }
    },

    /**
     * Uploads an image to Firebase Storage with validation and optional compression.
     * @param file The file to upload.
     * @param path The path in storage.
     * @param options Configuration for the upload.
     * @returns The public download URL of the uploaded file.
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