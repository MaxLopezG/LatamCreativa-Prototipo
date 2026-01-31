/**
 * Servicio de Almacenamiento Local
 * Reemplaza Firebase Storage con URLs locales
 */

export const localStorageService = {
    /**
     * Simular subida de imagen
     * Retorna un object URL para el archivo
     */
    uploadImage: async (file: File, path: string, options?: any): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        // Crear Object URL para el archivo
        const url = URL.createObjectURL(file);

        // Opcionalmente guardar en localStorage como data URL para persistencia
        // (esto puede ser pesado para archivos grandes)

        if (options?.onProgress) {
            options.onProgress(100);
        }

        return url;
    },

    /**
     * Eliminar imagen (no-op en modo local)
     */
    deleteFromUrl: async (url: string): Promise<void> => {
        // En modo local, solo revocamos el object URL si existe
        try {
            URL.revokeObjectURL(url);
        } catch (e) {
            // Ignorar errores
        }
    },

    /**
     * Obtener URL de descarga (retorna la misma URL)
     */
    getDownloadUrl: async (path: string): Promise<string> => {
        return path;
    }
};
