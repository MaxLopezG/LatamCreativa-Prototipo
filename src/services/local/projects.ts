/**
 * Servicio de Proyectos Local
 * Reemplaza Firebase Firestore para proyectos de portafolio
 */
import { PortfolioItem } from '../../types';
import { MOCK_PORTFOLIO_ITEMS } from '../../data/mockPortfolio';

const PROJECTS_STORAGE_KEY = 'latamcreativa_projects';

// Inicializar proyectos en localStorage si no existen
const initializeProjects = () => {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(MOCK_PORTFOLIO_ITEMS));
    }
};

// Obtener proyectos de localStorage
const getStoredProjects = (): PortfolioItem[] => {
    initializeProjects();
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_PORTFOLIO_ITEMS;
};

// Guardar proyectos en localStorage
const saveProjects = (projects: PortfolioItem[]) => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
};

export const localProjectsService = {
    /**
     * Obtener todos los proyectos (paginados)
     */
    getProjects: async (cursor: any = null, pageSize: number = 20) => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const projects = getStoredProjects();
        const sortedProjects = projects.sort((a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );

        return {
            data: sortedProjects.slice(0, pageSize),
            lastDoc: null,
            hasMore: sortedProjects.length > pageSize
        };
    },

    /**
     * Obtener un proyecto por ID
     */
    getProject: async (projectId: string): Promise<PortfolioItem | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const projects = getStoredProjects();
        return projects.find(p => p.id === projectId) || null;
    },

    /**
     * Obtener proyecto por slug
     */
    getProjectBySlug: async (slugOrId: string): Promise<PortfolioItem | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const projects = getStoredProjects();
        return projects.find(p => p.id === slugOrId || (p as any).slug === slugOrId) || null;
    },

    /**
     * Obtener proyectos de un usuario
     */
    getUserProjects: async (userId: string, limit?: number): Promise<PortfolioItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const projects = getStoredProjects();
        let userProjects = projects.filter(p => p.authorId === userId);

        if (limit) {
            userProjects = userProjects.slice(0, limit);
        }

        return userProjects;
    },

    /**
     * Obtener proyectos por IDs
     */
    getProjectsByIds: async (ids: string[]): Promise<PortfolioItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const projects = getStoredProjects();
        return projects.filter(p => ids.includes(p.id));
    },

    /**
     * Obtener proyectos recientes
     */
    getRecentProjects: async (limit: number = 20): Promise<PortfolioItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const projects = getStoredProjects();
        return projects
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, limit);
    },

    /**
     * Crear un nuevo proyecto
     */
    createProject: async (
        userId: string,
        projectData: Partial<PortfolioItem>,
        files: { cover?: File; gallery?: File[] },
        options: any
    ): Promise<{ id: string; slug: string }> => {
        await new Promise(resolve => setTimeout(resolve, 50));

        const projects = getStoredProjects();
        const newId = `project-${Date.now()}`;
        const slug = projectData.title?.toLowerCase().replace(/\s+/g, '-') || newId;

        // Simular URLs de imágenes (en producción usaríamos data URLs o un servicio real)
        let coverUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop';
        if (files.cover) {
            coverUrl = URL.createObjectURL(files.cover);
        }

        const newProject: PortfolioItem = {
            id: newId,
            title: projectData.title || 'Sin título',
            artist: projectData.artist || 'Usuario',
            authorId: userId,
            artistAvatar: projectData.artistAvatar,
            artistUsername: projectData.artistUsername,
            image: coverUrl,
            views: '0',
            likes: '0',
            category: projectData.category || '3D',
            description: projectData.description,
            software: projectData.software || [],
            domain: projectData.domain || 'creative',
            status: projectData.status || 'published',
            createdAt: new Date().toISOString(),
            gallery: projectData.gallery || [],
            images: projectData.images || []
        };

        projects.unshift(newProject);
        saveProjects(projects);

        if (options?.onProgress) {
            options.onProgress(100);
        }

        return { id: newId, slug };
    },

    /**
     * Actualizar un proyecto
     */
    updateProject: async (
        userId: string,
        projectId: string,
        projectData: Partial<PortfolioItem>,
        files: any,
        options: any
    ): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 50));

        const projects = getStoredProjects();
        const index = projects.findIndex(p => p.id === projectId);

        if (index !== -1) {
            projects[index] = { ...projects[index], ...projectData };
            saveProjects(projects);
        }

        if (options?.onProgress) {
            options.onProgress(100);
        }
    },

    /**
     * Eliminar un proyecto
     */
    deleteProject: async (userId: string, projectId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const projects = getStoredProjects();
        const filteredProjects = projects.filter(p => p.id !== projectId);
        saveProjects(filteredProjects);
    },

    /**
     * Incrementar vistas
     */
    incrementProjectView: async (projectId: string): Promise<void> => {
        const projects = getStoredProjects();
        const index = projects.findIndex(p => p.id === projectId);

        if (index !== -1) {
            const currentViews = parseInt(projects[index].views || '0');
            projects[index].views = String(currentViews + 1);
            saveProjects(projects);
        }
    },

    /**
     * Toggle like
     */
    toggleProjectLike: async (projectId: string, userId: string): Promise<boolean> => {
        const likesKey = `latamcreativa_likes_${userId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');

        const isLiked = likes.includes(projectId);

        if (isLiked) {
            const newLikes = likes.filter((id: string) => id !== projectId);
            localStorage.setItem(likesKey, JSON.stringify(newLikes));
        } else {
            likes.push(projectId);
            localStorage.setItem(likesKey, JSON.stringify(likes));
        }

        // Actualizar contador del proyecto
        const projects = getStoredProjects();
        const index = projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
            const currentLikes = parseInt(projects[index].likes || '0');
            projects[index].likes = String(isLiked ? currentLikes - 1 : currentLikes + 1);
            saveProjects(projects);
        }

        return !isLiked;
    },

    /**
     * Obtener estado de like
     */
    getProjectLikeStatus: async (projectId: string, userId: string): Promise<boolean> => {
        const likesKey = `latamcreativa_likes_${userId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');
        return likes.includes(projectId);
    },

    /**
     * Listener de proyectos de usuario (simulado)
     */
    listenToUserProjects: (userId: string, callback: (projects: PortfolioItem[]) => void) => {
        const projects = getStoredProjects().filter(p => p.authorId === userId);
        callback(projects);
        return () => { }; // Cleanup function
    },

    // Stubs para compatibilidad con la API existente
    addComment: async () => ({ id: 'mock-comment' }),
    listenToComments: () => () => { },
    deleteComment: async () => { },
    toggleCommentLike: async () => false,
    getCommentLikeStatus: async () => false,
    getCommentsLikeStatuses: async () => ({}),
    addCommentReply: async () => { }
};
