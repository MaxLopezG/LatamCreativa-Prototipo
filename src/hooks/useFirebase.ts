import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { api, PaginatedResult } from '../services/api';
import { PortfolioItem, ArticleItem, BlogComment } from '../types';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { NAV_SECTIONS, NAV_SECTIONS_DEV } from '../data/navigation';
import { articlesService } from '../services/modules/articles';
import { usersService } from '../services/modules/users';
import { projectsService } from '../services/modules/projects';

// --- Hook for User Profile ---
export const useUserProfile = (userId: string | null) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await usersService.getPublicProfile(userId);
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
                authorAvatar: state.user.avatar,
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

// --- Hook for Blog Articles (Paged) ---
export const useArticles = () => {
    const { state, actions } = useAppStore();
    const { articles, pageStack, currentPage, hasMore, loading, lastDoc, sortOption } = state.blogState;
    const [error, setError] = useState<string | null>(null);

    // Initial Load (only if empty)
    useEffect(() => {
        if (articles.length === 0 && !loading) {
            fetchPage(null);
        }
    }, [articles.length]);

    // Re-fetch when Sort Option changes
    useEffect(() => {
        if (!loading) { // Avoid double fetch if already loading
            // Reset Pagination State on Sort Change or Category Change
            actions.setBlogState({
                pageStack: [],
                currentPage: 1,
                lastDoc: null,
                hasMore: true,
                articles: []
            });
            fetchPage(null);
        }
    }, [sortOption, state.activeCategory]);

    const fetchPage = async (startAfterDoc: QueryDocumentSnapshot<DocumentData> | null) => {
        // Prevent race conditions or multi-calls handled by check above, but good to have safety
        // if (loading) return; 
        // Note: We intentionally allow re-entry if triggered by sort change logic which might have cleared loading

        actions.setBlogState({ loading: true });
        setError(null);

        try {
            // Check Sort Option
            let sortField: 'date' | 'likes' = 'date';
            let sortDir: 'desc' | 'asc' = 'desc';

            if (sortOption === 'popular') {
                sortField = 'likes';
                sortDir = 'desc';
            } else if (sortOption === 'oldest') {
                sortField = 'date';
                sortDir = 'asc';
            }

            let result;
            const category = state.activeCategory;
            const isHome = category === 'Home' || category === 'Todas';
            const isTrending = category === 'Tendencias';
            const isNew = category === 'Nuevos';

            // 1. If Category Selected (not Home/Trending/New special cases)
            if (!isHome && !isTrending && !isNew) {

                // Identify if 'category' is actually a Tag (Sub-item in nav)
                // We check all sections to see if this label exists as a subItem
                const isTag = NAV_SECTIONS.some(section =>
                    section.items.some(item => item.subItems?.includes(category))
                ) || NAV_SECTIONS_DEV.some(section =>
                    section.items.some(item => item.subItems?.includes(category))
                );

                if (isTag) {
                    result = await articlesService.getArticlesByTag(category, startAfterDoc, 10);
                } else {
                    // We treat categories as a list, but activeCategory is a string
                    result = await articlesService.getArticlesByCategories([category], startAfterDoc, 10);
                }

            } else {
                // 2. Default / Home / Sort-Based Fetching
                const resultFetch = await articlesService.getArticles(startAfterDoc, 10, sortField, sortDir);
                result = resultFetch;
            }
            actions.setBlogState({
                articles: result.data,
                lastDoc: result.lastDoc,
                hasMore: result.hasMore,
                loading: false
            });
        } catch (err: any) {
            setError(err.message || 'Error loading articles');
            actions.setBlogState({ loading: false });
        }
    };

    const nextPage = () => {
        if (!hasMore || loading) return;
        // Save current lastDoc to stack before moving
        const currentStack = [...pageStack];
        if (lastDoc) currentStack.push(lastDoc);

        actions.setBlogState({
            pageStack: currentStack,
            currentPage: currentPage + 1
        });

        fetchPage(lastDoc);
    };

    const prevPage = () => {
        if (currentPage <= 1 || loading) return;
        const currentStack = [...pageStack];
        const newPage = currentPage - 1;

        let targetDoc = null;
        if (newPage > 1) {
            targetDoc = currentStack[newPage - 2];
        }

        const newStack = currentStack.slice(0, newPage - 1);

        actions.setBlogState({
            pageStack: newStack,
            currentPage: newPage
        });

        fetchPage(targetDoc);
    };

    return {
        articles,
        loading,
        error,
        hasMore,
        currentPage,
        nextPage,
        prevPage,
        // Legacy alias to prevent crash during transition
        loadMore: nextPage
    };
};

// --- Hook for Creating Article ---
export const useCreateArticle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (data: Omit<ArticleItem, 'id'>, file?: File) => {
        setLoading(true);
        setError(null);
        try {
            const id = await articlesService.createArticle(data, file);
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
export const useUserArticles = (authorName: string | undefined, authorId?: string | undefined) => {
    const [articles, setArticles] = useState<ArticleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authorName && !authorId) return;

        const fetchArticles = async () => {
            setLoading(true);
            try {
                const data = await articlesService.getUserArticles(authorName || '', authorId);
                setArticles(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [authorName, authorId]);

    return { articles, loading, error };
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
                // We use userId as the primary key. userName is ignored in the new service pattern or used as fallback if implemented.
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
                const data = await articlesService.getArticle(articleId);
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

// --- Hook for Recommended Articles ---
export const useRecommendedArticles = (currentArticleId: string) => {
    const [articles, setArticles] = useState<ArticleItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                // Fetch 4 to safely exclude current one and keep 3
                const result = await articlesService.getArticles(null, 4);
                const filtered = result.data
                    .filter(a => a.id !== currentArticleId)
                    .slice(0, 3);
                setArticles(filtered);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (currentArticleId) fetch();
    }, [currentArticleId]);

    return { articles, loading };
};

// --- Hook for Deleting Article ---
export const useDeleteArticle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deletePost = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await articlesService.deleteArticle(id);
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
            await articlesService.updateArticle(id, data, file);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
};
// --- Hook for Comments ---
export const useComments = (articleId: string | undefined) => {
    const [comments, setComments] = useState<BlogComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = async () => {
        if (!articleId) return;
        setLoading(true);
        try {
            const data = await articlesService.getComments(articleId);
            setComments(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [articleId]);

    const removeComment = (commentId: string) => {
        setComments(prev => prev.filter(c => c.id !== commentId));
    };

    return { comments, loading, error, refresh: fetchComments, removeComment };
};

export const useAddComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const add = async (articleId: string, data: Omit<BlogComment, 'id' | 'timeAgo' | 'likes' | 'replies' | 'date'>) => {
        setLoading(true);
        setError(null);
        try {
            await articlesService.addComment(articleId, data);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return { add, loading, error };
};

// --- Hook for Subscriptions ---
export const useSubscription = (targetUserId: string, currentUserId: string | undefined) => {
    const { actions } = useAppStore();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Initial check and fetch count
    const init = async () => {
        if (!targetUserId) return;
        setLoading(true);
        try {
            // Check if subscribed
            if (currentUserId) {
                const subscribed = await usersService.getSubscriptionStatus(targetUserId, currentUserId);
                setIsSubscribed(subscribed);
            }

            // Fetch subscriber count
            const followers = await usersService.getFollowers(targetUserId);
            setSubscriberCount(followers.length);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
    }, [targetUserId, currentUserId]);

    const toggleSubscription = async () => {
        if (!currentUserId || !targetUserId) return;

        // Optimistic update: Store previous state for rollback
        const previousIsSubscribed = isSubscribed;
        // Calculate new count immediately
        const offset = previousIsSubscribed ? -1 : 1;

        // Update UI immediately (Optimistic)
        setIsSubscribed(!previousIsSubscribed);
        setSubscriberCount(prev => Math.max(0, prev + offset));

        // Don't set loading(true) here to avoid disabling the button, giving instant feedback

        try {
            if (previousIsSubscribed) {
                await usersService.unsubscribeFromUser(targetUserId, currentUserId);
            } else {
                await usersService.subscribeToUser(targetUserId, currentUserId);
            }
            // Trigger global update for sidebar
            actions.triggerSubscriptionUpdate();
        } catch (error) {
            console.error("Error toggling subscription:", error);
            // Revert state on error
            setIsSubscribed(previousIsSubscribed);
            setSubscriberCount(prev => Math.max(0, prev - offset));
        }
    };

    return { isSubscribed, loading, toggleSubscription, setSubscriberCount, subscriberCount };
};


export const useCommentActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const like = async (articleId: string, commentId: string) => {
        try {
            await articlesService.likeComment(articleId, commentId);
        } catch (err: any) {
            console.error(err);
        }
    };

    const update = async (articleId: string, commentId: string, content: string) => {
        setLoading(true);
        try {
            await articlesService.updateComment(articleId, commentId, content);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (articleId: string, commentId: string) => {
        setLoading(true);
        try {
            await articlesService.deleteComment(articleId, commentId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { like, update, remove, loading, error };
};

// --- Hook for Article Like ---
export const useArticleLike = (articleId: string | undefined, userId: string | undefined) => {
    const [isLiked, setIsLiked] = useState(false);
    const [initialIsLiked, setInitialIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkLike = async () => {
            if (!articleId || !userId) return;
            const status = await articlesService.getArticleLikeStatus(articleId, userId);
            setIsLiked(status);
            setInitialIsLiked(status);
        };
        checkLike();
    }, [articleId, userId]);

    const toggleLike = async () => {
        if (!articleId || !userId) return;

        // Optimistic update
        const previousState = isLiked;
        setIsLiked(!previousState);

        try {
            const newState = await articlesService.toggleArticleLike(articleId, userId);
            setIsLiked(newState);
            // Verify if we need to update initial logic? No, initial logic is "was it liked when loaded".
            // If API fails, we revert.
        } catch (error) {
            console.error("Error toggling like:", error);
            setIsLiked(previousState); // Revert on error
        }
    };

    return { isLiked, initialIsLiked, toggleLike, loading };
};
