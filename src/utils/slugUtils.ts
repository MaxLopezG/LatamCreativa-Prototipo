/**
 * Slug Utility Functions
 * 
 * Creates URL-friendly slugs from text for SEO-friendly URLs.
 */

/**
 * Converts a string to a URL-friendly slug.
 * 
 * @param text - The text to convert (e.g., article title)
 * @returns Lowercase slug with hyphens (e.g., "mi-articulo-genial")
 * 
 * @example
 * generateSlug("Mi Artículo Genial") // "mi-articulo-genial"
 * generateSlug("3D Art: Diseño & Modelado") // "3d-art-diseno-modelado"
 */
export const generateSlug = (text: string): string => {
    if (!text) return '';

    return text
        .normalize('NFD')                          // Decompose accented characters
        .replace(/[\u0300-\u036f]/g, '')           // Remove accent marks
        .toLowerCase()                             // Convert to lowercase
        .trim()                                    // Remove leading/trailing spaces
        .replace(/[^a-z0-9\s-]/g, '')             // Remove special characters
        .replace(/\s+/g, '-')                      // Replace spaces with hyphens
        .replace(/-+/g, '-')                       // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '');                  // Remove leading/trailing hyphens
};

/**
 * Generates a unique slug by appending a short random suffix.
 * Useful to avoid collisions when multiple items have similar titles.
 * 
 * @param text - The text to convert
 * @returns Slug with unique suffix (e.g., "mi-articulo-a1b2c3")
 */
export const generateUniqueSlug = (text: string): string => {
    const baseSlug = generateSlug(text);
    const uniqueSuffix = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${uniqueSuffix}`;
};

/**
 * Validates if a string is a valid slug format.
 * 
 * @param slug - The slug to validate
 * @returns True if valid slug format
 */
export const isValidSlug = (slug: string): boolean => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};
