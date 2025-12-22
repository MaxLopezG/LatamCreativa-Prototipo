/**
 * Project Hooks
 * Domain-specific hooks for project-related operations (Portfolio)
 */

import { useState, useEffect } from 'react';
import { useAppStore } from './useAppStore';
import { PortfolioItem } from '../types';
import { projectsService } from '../services/modules/projects';

// --- Hook for Fetching Single Project ---
export const useProject = (id: string | undefined) => {
    const [project, setProject] = useState<PortfolioItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            setLoading(true);
            try {
                const data = await projectsService.getProject(id);
                setProject(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    return { project, loading, error };
};

// --- Hook for Creating Project ---
export const useCreateProject = () => {
    const { state } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const create = async (
        projectData: Partial<PortfolioItem>,
        files: { cover?: File | null; gallery?: File[] },
        uploadOptions: {
            maxSizeMB: number;
            galleryMetadata?: { type: 'image' | 'youtube'; caption: string; fileIndex?: number; url?: string }[]
        }
    ) => {
        if (!state.user?.id) {
            throw new Error("Debes iniciar sesión para crear un proyecto.");
        }

        setLoading(true);
        setProgress(0);
        setError(null);
        try {
            const finalFiles = {
                cover: files.cover || undefined,
                gallery: files.gallery
            };

            const id = await projectsService.createProject(
                state.user.id,
                projectData,
                finalFiles,
                {
                    ...uploadOptions,
                    onProgress: setProgress
                }
            );
            return id;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error, progress };
};

// --- Hook for Updating Project ---
export const useUpdateProject = () => {
    const { state } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const update = async (
        projectId: string,
        projectData: Partial<PortfolioItem>,
        files: { cover?: File | null; gallery?: File[] },
        uploadOptions: {
            maxSizeMB: number;
            galleryMetadata?: { type: 'image' | 'youtube'; caption: string; fileIndex?: number; url?: string }[]
        }
    ) => {
        if (!state.user?.id) {
            throw new Error("Debes iniciar sesión para editar un proyecto.");
        }

        setLoading(true);
        setProgress(0);
        setError(null);
        try {
            const finalFiles = {
                cover: files.cover || undefined,
                gallery: files.gallery
            };

            await projectsService.updateProject(
                state.user.id,
                projectId,
                projectData,
                finalFiles,
                {
                    ...uploadOptions,
                    onProgress: setProgress
                }
            );
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error, progress };
};

// --- Hook for Deleting Project ---
export const useDeleteProject = () => {
    const { state } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteProject = async (id: string) => {
        if (!state.user?.id) {
            throw new Error("Debes iniciar sesión para eliminar un proyecto.");
        }

        setLoading(true);
        setError(null);
        try {
            await projectsService.deleteProject(state.user.id, id);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deleteProject, loading, error };
};

// --- Hook for User Projects ---
export const useUserProjects = (userId: string | undefined, userName: string | undefined) => {
    const [projects, setProjects] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId && !userName) return;

        const fetchProjects = async () => {
            setLoading(true);
            try {
                const data = await projectsService.getUserProjects(userId || '');
                setProjects(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [userId, userName]);

    const removeProject = (projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    };

    return { projects, loading, error, removeProject };
};

// --- Hook for Project Comments ---
export const useProjectComments = (projectId: string | undefined) => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const unsubscribe = projectsService.listenToComments(projectId, (newComments) => {
                setComments(newComments);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }, [projectId]);

    return { comments, loading, error };
};

// --- Hook for Adding Project Comment ---
export const useAddProjectComment = () => {
    const { state } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const add = async (projectId: string, text: string) => {
        if (!state.user) {
            throw new Error("Debes iniciar sesión para comentar.");
        }
        setLoading(true);
        setError(null);
        try {
            await projectsService.addComment(projectId, {
                authorId: state.user.id,
                authorName: state.user.name,
                authorUsername: state.user.username || '',
                authorAvatar: state.user.avatar || '',
                text,
            });
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { add, loading, error };
};

// --- Hook for Deleting Project Comment ---
export const useDeleteProjectComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remove = async (projectId: string, commentId: string) => {
        setLoading(true);
        setError(null);
        try {
            await projectsService.deleteComment(projectId, commentId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
};
