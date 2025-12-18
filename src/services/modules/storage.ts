import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const storageService = {
    /**
     * Uploads a file to Firebase Storage
     * @param path The path where the file should be stored (e.g., 'users/avatar.jpg')
     * @param file The file to upload
     * @returns The download URL of the uploaded file
     */
    async uploadFile(path: string, file: File): Promise<string> {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    },

    /**
     * Deletes a file from Firebase Storage
     * @param path The path of the file to delete (or the full URL)
     */
    async deleteFile(path: string): Promise<void> {
        try {
            // If it's a full URL, we can reference it directly or parse it. 
            // ref() accepts a full HTTPS URL for the file as well.
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }
};
