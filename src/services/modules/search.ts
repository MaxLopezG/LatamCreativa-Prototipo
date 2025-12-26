/**
 * Servicio de Búsqueda Global
 * 
 * Proporciona búsqueda en tiempo real sobre proyectos, artículos y usuarios.
 * 
 * @module services/search
 */
import { db } from '../../lib/firebase';
import {
    collection,
    query,
    where,
    limit,
    getDocs,
    QueryConstraint
} from 'firebase/firestore';

export interface SearchResult {
    id: string;
    type: 'project' | 'article' | 'user';
    title: string;
    subtitle?: string;
    image?: string;
    slug?: string;
    username?: string;
}

export interface SearchFilters {
    type?: 'project' | 'article' | 'user' | 'all';
    maxResults?: number;
}

const DEFAULT_MAX_RESULTS = 8;

/**
 * Normaliza un string para búsqueda (minúsculas, sin acentos, etc)
 */
const normalizeSearch = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
};

/**
 * Busca en proyectos por título, autor, categoría, tags y software/programas
 */
const searchProjects = async (searchTerm: string, maxResults: number): Promise<SearchResult[]> => {
    try {
        const normalizedTerm = normalizeSearch(searchTerm);
        const projectsRef = collection(db, 'projects');

        // Firestore no soporta búsqueda full-text nativa, 
        // obtenemos documentos y filtramos en el cliente
        const constraints: QueryConstraint[] = [
            where('status', '==', 'published'),
            limit(100) // Buscamos más para poder filtrar
        ];

        const snapshot = await getDocs(query(projectsRef, ...constraints));

        const results: SearchResult[] = [];

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const title = data.title || '';
            const normalizedTitle = normalizeSearch(title);
            const authorName = normalizeSearch(data.authorName || data.artist || '');
            const category = normalizeSearch(data.category || '');
            const tags = (data.tags || []).map((t: string) => normalizeSearch(t));
            // Agregar búsqueda por software/programas
            const software = (data.software || []).map((s: string) => normalizeSearch(s));
            const description = normalizeSearch(data.description || '');

            // Buscar coincidencias en título, autor, categoría, tags, software o descripción
            const matchesTitle = normalizedTitle.includes(normalizedTerm);
            const matchesAuthor = authorName.includes(normalizedTerm);
            const matchesCategory = category.includes(normalizedTerm);
            const matchesTags = tags.some((tag: string) => tag.includes(normalizedTerm));
            const matchesSoftware = software.some((sw: string) => sw.includes(normalizedTerm));
            const matchesDescription = description.includes(normalizedTerm);

            if (matchesTitle || matchesAuthor || matchesCategory || matchesTags || matchesSoftware || matchesDescription) {
                // Build a more informative subtitle
                let subtitle = `por ${data.authorName || data.artist || 'Anónimo'}`;
                if (matchesSoftware && data.software) {
                    const matchedSw = data.software.find((s: string) => normalizeSearch(s).includes(normalizedTerm));
                    if (matchedSw) subtitle += ` • ${matchedSw}`;
                } else if (data.category) {
                    subtitle += ` • ${data.category}`;
                }

                results.push({
                    id: doc.id,
                    type: 'project',
                    title: title,
                    subtitle,
                    image: data.images?.[0] || data.thumbnail,
                    slug: data.slug
                });
            }
        });

        return results.slice(0, maxResults);
    } catch (error) {
        console.error('Error searching projects:', error);
        return [];
    }
};

/**
 * Busca en artículos por título, autor, categoría, tags y contenido
 */
const searchArticles = async (searchTerm: string, maxResults: number): Promise<SearchResult[]> => {
    try {
        const normalizedTerm = normalizeSearch(searchTerm);
        const articlesRef = collection(db, 'articles');

        const constraints: QueryConstraint[] = [
            where('status', '==', 'published'),
            limit(100)
        ];

        const snapshot = await getDocs(query(articlesRef, ...constraints));

        const results: SearchResult[] = [];

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const title = data.title || '';
            const normalizedTitle = normalizeSearch(title);
            const authorName = normalizeSearch(data.authorName || data.author || '');
            const category = normalizeSearch(data.category || '');
            const tags = (data.tags || []).map((t: string) => normalizeSearch(t));
            const excerpt = normalizeSearch(data.excerpt || '');

            // Buscar coincidencias
            const matchesTitle = normalizedTitle.includes(normalizedTerm);
            const matchesAuthor = authorName.includes(normalizedTerm);
            const matchesCategory = category.includes(normalizedTerm);
            const matchesTags = tags.some((tag: string) => tag.includes(normalizedTerm));
            const matchesExcerpt = excerpt.includes(normalizedTerm);

            if (matchesTitle || matchesAuthor || matchesCategory || matchesTags || matchesExcerpt) {
                // Build informative subtitle
                let subtitle = `por ${data.authorName || data.author || 'Anónimo'}`;
                if (matchesTags && data.tags) {
                    const matchedTag = data.tags.find((t: string) => normalizeSearch(t).includes(normalizedTerm));
                    if (matchedTag) subtitle += ` • #${matchedTag}`;
                } else if (data.category) {
                    subtitle += ` • ${data.category}`;
                }

                results.push({
                    id: doc.id,
                    type: 'article',
                    title: title,
                    subtitle,
                    image: data.coverImage,
                    slug: data.slug
                });
            }
        });

        return results.slice(0, maxResults);
    } catch (error) {
        console.error('Error searching articles:', error);
        return [];
    }
};

/**
 * Busca en usuarios por nombre o username
 */
const searchUsers = async (searchTerm: string, maxResults: number): Promise<SearchResult[]> => {
    try {
        const normalizedTerm = normalizeSearch(searchTerm);
        const usersRef = collection(db, 'users');

        const snapshot = await getDocs(query(usersRef, limit(100)));

        const results: SearchResult[] = [];

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const name = data.name || '';
            const username = data.username || '';
            const normalizedName = normalizeSearch(name);
            const normalizedUsername = normalizeSearch(username);
            const role = normalizeSearch(data.role || data.profession || '');
            // Include skills in search
            const skills = (data.skills || []).map((s: string) => normalizeSearch(s));

            if (
                normalizedName.includes(normalizedTerm) ||
                normalizedUsername.includes(normalizedTerm) ||
                role.includes(normalizedTerm) ||
                skills.some((skill: string) => skill.includes(normalizedTerm))
            ) {
                // Build subtitle with matching skill if found
                let subtitle = `@${username || doc.id.slice(0, 8)}`;
                const matchingSkill = skills.find((skill: string) => skill.includes(normalizedTerm));
                if (matchingSkill && data.skills) {
                    const originalSkill = data.skills.find((s: string) => normalizeSearch(s).includes(normalizedTerm));
                    subtitle += originalSkill ? ` • Experto en ${originalSkill}` : ` • ${data.role || data.profession || 'Usuario'}`;
                } else {
                    subtitle += ` • ${data.role || data.profession || 'Usuario'}`;
                }

                results.push({
                    id: doc.id,
                    type: 'user',
                    title: name,
                    subtitle,
                    image: data.avatar || data.profileImage,
                    username: username || doc.id
                });
            }
        });

        return results.slice(0, maxResults);
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
};

/**
 * Búsqueda global que combina resultados de proyectos, artículos y usuarios
 * OPTIMIZADO: Ejecuta las búsquedas en PARALELO para mayor velocidad
 */
export const globalSearch = async (
    searchTerm: string,
    filters: SearchFilters = {}
): Promise<SearchResult[]> => {
    if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
    }

    const { type = 'all', maxResults = DEFAULT_MAX_RESULTS } = filters;
    const perTypeLimit = Math.ceil(maxResults / 3);

    try {
        // Si se busca un tipo específico, solo buscar en ese tipo
        if (type !== 'all') {
            switch (type) {
                case 'project':
                    return await searchProjects(searchTerm, maxResults);
                case 'article':
                    return await searchArticles(searchTerm, maxResults);
                case 'user':
                    return await searchUsers(searchTerm, maxResults);
                default:
                    return [];
            }
        }

        // PARALELO: Ejecutar las tres búsquedas simultáneamente
        const [projects, articles, users] = await Promise.all([
            searchProjects(searchTerm, perTypeLimit),
            searchArticles(searchTerm, perTypeLimit),
            searchUsers(searchTerm, perTypeLimit)
        ]);

        // Combinar resultados
        const results = [...projects, ...articles, ...users];

        // Limitar al máximo total
        return results.slice(0, maxResults);
    } catch (error) {
        console.error('Error in global search:', error);
        return [];
    }
};

export const searchService = {
    search: globalSearch,
    searchProjects,
    searchArticles,
    searchUsers
};
