import { useState, useEffect, useCallback } from 'react';
import { api, PaginatedResult } from '../services/api';
import { PortfolioItem, ArticleItem } from '../types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// --- Hook for Infinite Scroll Feed ---
export const useProjects = () => {
    const [projects, setProjects] = useState<PortfolioItem[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);
        setError(null);

        try {
            const currentLastDoc = reset ? null : lastDoc;
            const result = await api.getProjects(currentLastDoc);

            if (reset) {
                setProjects(result.data);
            } else {
                setProjects(prev => [...prev, ...result.data]);
            }

            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
        } catch (err: any) {
            setError(err.message || 'Error loading projects');
        } finally {
            setLoading(false);
        }
    }, [lastDoc, hasMore, loading]);

    // Initial load
    useEffect(() => {
        loadMore(true);
    }, []);

    return { projects, loading, error, hasMore, loadMore };
};

// --- Hook for User Profile ---
export const useUserProfile = (userId: string | null) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await api.getUserProfile(userId);
                setProfile(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    return { profile, loading };
};

// --- Hook for Creating Project ---
export const useCreateProject = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: any, file?: File) => {
        setLoading(true);
        setError(null);
        try {
            const id = await api.createProject(data, file);
            return id;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};

// --- Hook for Admin: All Users ---
export const useAllUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await api.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading };
};

// --- Hook for Blog Articles ---
export const useArticles = () => {
    const [articles, setArticles] = useState<ArticleItem[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async (reset = false) => {
        if (loading || (!hasMore && !reset)) return;

        setLoading(true);
        setError(null);

        try {
            const currentLastDoc = reset ? null : lastDoc;
            const result = await api.getArticles(currentLastDoc);

            if (reset) {
                setArticles(result.data);
            } else {
                setArticles(prev => [...prev, ...result.data]);
            }

            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
        } catch (err: any) {
            setError(err.message || 'Error loading articles');
        } finally {
            setLoading(false);
        }
    }, [lastDoc, hasMore, loading]);

    // Initial load
    useEffect(() => {
        loadMore(true);
    }, []);

    return { articles, loading, error, hasMore, loadMore };
};

// --- Hook for Creating Article ---
export const useCreateArticle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: Omit<ArticleItem, 'id'>, file?: File) => {
        setLoading(true);
        setError(null);
        try {
            const id = await api.createArticle(data, file);
            return id;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};

// --- Hook for User Articles ---
export const useUserArticles = (authorName: string | undefined) => {
    const [articles, setArticles] = useState<ArticleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authorName) return;

        const fetchArticles = async () => {
            setLoading(true);
            try {
                const data = await api.getUserArticles(authorName);
                setArticles(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [authorName]);

    return { articles, loading, error };
};

// --- Hook for Single Article ---
export const useArticle = (articleId: string | undefined) => {
    const [article, setArticle] = useState<ArticleItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!articleId) return;

        const fetchArticle = async () => {
            setLoading(true);
            try {
                const data = await api.getArticle(articleId);
                setArticle(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    return { article, loading, error };
};

// --- Hook for Deleting Article ---
export const useDeleteArticle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deletePost = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await api.deleteArticle(id);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { deletePost, loading, error };
};

// --- Hook for Updating Article ---
export const useUpdateArticle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (id: string, data: Partial<ArticleItem>, file?: File) => {
        setLoading(true);
        setError(null);
        try {
            await api.updateArticle(id, data, file);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};
