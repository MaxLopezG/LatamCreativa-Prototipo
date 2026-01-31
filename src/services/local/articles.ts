/**
 * Servicio de Artículos Local
 * Reemplaza Firebase Firestore para artículos del blog
 */
import { ArticleItem } from '../../types';
import { MOCK_BLOG_ARTICLES } from '../../data/mockBlog';

const ARTICLES_STORAGE_KEY = 'latamcreativa_articles';

// Inicializar artículos en localStorage si no existen
const initializeArticles = () => {
    const stored = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(MOCK_BLOG_ARTICLES));
    }
};

// Obtener artículos de localStorage
const getStoredArticles = (): ArticleItem[] => {
    initializeArticles();
    const stored = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_BLOG_ARTICLES;
};

// Guardar artículos en localStorage
const saveArticles = (articles: ArticleItem[]) => {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
};

export const localArticlesService = {
    /**
     * Obtener todos los artículos (paginados)
     */
    getArticles: async (cursor: any = null, pageSize: number = 10) => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const articles = getStoredArticles();
        const sortedArticles = articles
            .filter(a => a.status === 'published')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return {
            data: sortedArticles.slice(0, pageSize),
            lastDoc: null,
            hasMore: sortedArticles.length > pageSize
        };
    },

    /**
     * Obtener un artículo por ID
     */
    getArticle: async (articleId: string): Promise<ArticleItem | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const articles = getStoredArticles();
        return articles.find(a => a.id === articleId) || null;
    },

    /**
     * Obtener artículo por slug
     */
    getArticleBySlug: async (slugOrId: string): Promise<ArticleItem | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const articles = getStoredArticles();
        return articles.find(a => a.id === slugOrId) || null;
    },

    /**
     * Obtener artículos de un usuario
     */
    getUserArticles: async (userId: string, limit?: number): Promise<ArticleItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const articles = getStoredArticles();
        let userArticles = articles.filter(a => a.authorId === userId);

        if (limit) {
            userArticles = userArticles.slice(0, limit);
        }

        return userArticles;
    },

    /**
     * Obtener artículos recientes
     */
    getRecentArticles: async (limit: number = 10): Promise<ArticleItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const articles = getStoredArticles();
        return articles
            .filter(a => a.status === 'published')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
    },

    /**
     * Crear un nuevo artículo
     */
    createArticle: async (
        userId: string,
        articleData: Partial<ArticleItem>,
        coverFile?: File,
        options?: any
    ): Promise<{ id: string; slug: string }> => {
        await new Promise(resolve => setTimeout(resolve, 50));

        const articles = getStoredArticles();
        const newId = `article-${Date.now()}`;
        const slug = articleData.title?.toLowerCase().replace(/\s+/g, '-') || newId;

        let coverUrl = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop';
        if (coverFile) {
            coverUrl = URL.createObjectURL(coverFile);
        }

        const newArticle: ArticleItem = {
            id: newId,
            title: articleData.title || 'Sin título',
            excerpt: articleData.excerpt || '',
            image: articleData.image || coverUrl,
            author: articleData.author || 'Usuario',
            authorId: userId,
            authorAvatar: articleData.authorAvatar || '',
            date: new Date().toISOString(),
            readTime: articleData.readTime || '5 min',
            category: articleData.category || 'General',
            likes: 0,
            comments: 0,
            content: articleData.content || '',
            domain: articleData.domain || 'creative',
            status: articleData.status || 'published',
            tags: articleData.tags || [],
            views: 0
        };

        articles.unshift(newArticle);
        saveArticles(articles);

        if (options?.onProgress) {
            options.onProgress(100);
        }

        return { id: newId, slug };
    },

    /**
     * Actualizar un artículo
     */
    updateArticle: async (
        articleId: string,
        articleData: Partial<ArticleItem>
    ): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 50));

        const articles = getStoredArticles();
        const index = articles.findIndex(a => a.id === articleId);

        if (index !== -1) {
            articles[index] = { ...articles[index], ...articleData };
            saveArticles(articles);
        }
    },

    /**
     * Eliminar un artículo
     */
    deleteArticle: async (articleId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const articles = getStoredArticles();
        const filteredArticles = articles.filter(a => a.id !== articleId);
        saveArticles(filteredArticles);
    },

    /**
     * Incrementar vistas
     */
    incrementArticleView: async (articleId: string): Promise<void> => {
        const articles = getStoredArticles();
        const index = articles.findIndex(a => a.id === articleId);

        if (index !== -1) {
            articles[index].views = (articles[index].views || 0) + 1;
            saveArticles(articles);
        }
    },

    /**
     * Toggle like
     */
    toggleArticleLike: async (articleId: string, userId: string): Promise<boolean> => {
        const likesKey = `latamcreativa_article_likes_${userId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');

        const isLiked = likes.includes(articleId);

        if (isLiked) {
            const newLikes = likes.filter((id: string) => id !== articleId);
            localStorage.setItem(likesKey, JSON.stringify(newLikes));
        } else {
            likes.push(articleId);
            localStorage.setItem(likesKey, JSON.stringify(likes));
        }

        // Actualizar contador del artículo
        const articles = getStoredArticles();
        const index = articles.findIndex(a => a.id === articleId);
        if (index !== -1) {
            articles[index].likes = isLiked ? articles[index].likes - 1 : articles[index].likes + 1;
            saveArticles(articles);
        }

        return !isLiked;
    },

    /**
     * Obtener estado de like
     */
    getArticleLikeStatus: async (articleId: string, userId: string): Promise<boolean> => {
        const likesKey = `latamcreativa_article_likes_${userId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');
        return likes.includes(articleId);
    },

    /**
     * Listener de artículos de usuario (simulado)
     */
    listenToUserArticles: (userId: string, callback: (articles: ArticleItem[]) => void) => {
        const articles = getStoredArticles().filter(a => a.authorId === userId);
        callback(articles);
        return () => { }; // Cleanup function
    },

    // Stubs para compatibilidad
    addComment: async () => ({ id: 'mock-comment' }),
    listenToComments: () => () => { },
    deleteComment: async () => { },
    toggleCommentLike: async () => false,
    getCommentLikeStatus: async () => false,
    getCommentsLikeStatuses: async () => ({})
};
