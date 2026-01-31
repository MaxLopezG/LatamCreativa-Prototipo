/**
 * Servicio de Foro Local
 * Reemplaza Firebase Firestore para el foro
 */
import { ForumThread, ForumReply, ForumCategory } from '../../types/forum';
import { MOCK_FORUM_CATEGORIES, MOCK_FORUM_THREADS, MOCK_FORUM_REPLIES } from '../../data/mockForum';

const THREADS_STORAGE_KEY = 'latamcreativa_forum_threads';
const REPLIES_STORAGE_KEY = 'latamcreativa_forum_replies';

// Inicializar datos
const initializeData = () => {
    if (!localStorage.getItem(THREADS_STORAGE_KEY)) {
        localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(MOCK_FORUM_THREADS));
    }
    if (!localStorage.getItem(REPLIES_STORAGE_KEY)) {
        localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(MOCK_FORUM_REPLIES));
    }
};

const getStoredThreads = (): ForumThread[] => {
    initializeData();
    const stored = localStorage.getItem(THREADS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_FORUM_THREADS;
};

const getStoredReplies = (): ForumReply[] => {
    initializeData();
    const stored = localStorage.getItem(REPLIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_FORUM_REPLIES;
};

const saveThreads = (threads: ForumThread[]) => {
    localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
};

const saveReplies = (replies: ForumReply[]) => {
    localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(replies));
};

export const localForumService = {
    // === Categorías ===

    /**
     * Obtener todas las categorías
     */
    getCategories: async (): Promise<ForumCategory[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return MOCK_FORUM_CATEGORIES;
    },

    /**
     * Obtener categoría por ID
     */
    getCategoryById: async (categoryId: string): Promise<ForumCategory | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return MOCK_FORUM_CATEGORIES.find(c => c.id === categoryId) || null;
    },

    /**
     * Obtener categoría por slug
     */
    getCategoryBySlug: async (slug: string): Promise<ForumCategory | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return MOCK_FORUM_CATEGORIES.find(c => c.slug === slug) || null;
    },

    // === Threads ===

    /**
     * Obtener threads (paginados)
     */
    getThreads: async (options?: { category?: string; limit?: number }) => {
        await new Promise(resolve => setTimeout(resolve, 10));

        let threads = getStoredThreads();

        if (options?.category) {
            threads = threads.filter(t => t.category === options.category);
        }

        // Ordenar: pinned primero, luego por fecha
        threads.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        if (options?.limit) {
            threads = threads.slice(0, options.limit);
        }

        return {
            data: threads,
            lastDoc: null,
            hasMore: false
        };
    },

    /**
     * Obtener thread por ID
     */
    getThreadById: async (threadId: string): Promise<ForumThread | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const threads = getStoredThreads();
        return threads.find(t => t.id === threadId) || null;
    },

    /**
     * Obtener thread por slug
     */
    getThreadBySlug: async (slug: string): Promise<ForumThread | null> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const threads = getStoredThreads();
        return threads.find(t => t.slug === slug) || null;
    },

    /**
     * Crear nuevo thread
     */
    createThread: async (threadData: Partial<ForumThread>, userId: string): Promise<ForumThread> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const threads = getStoredThreads();
        const slug = (threadData.title || 'nuevo-hilo').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const newThread: ForumThread = {
            id: `thread-${Date.now()}`,
            slug: `${slug}-${Date.now()}`,
            title: threadData.title || 'Sin título',
            content: threadData.content || '',
            authorId: userId,
            authorName: threadData.authorName || 'Usuario',
            authorUsername: threadData.authorUsername || 'usuario',
            authorAvatar: threadData.authorAvatar || '',
            category: threadData.category || 'cat-general',
            tags: threadData.tags || [],
            views: 0,
            replies: 0,
            likes: 0,
            isPinned: false,
            isClosed: false,
            isResolved: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString()
        };

        threads.unshift(newThread);
        saveThreads(threads);

        return newThread;
    },

    /**
     * Actualizar thread
     */
    updateThread: async (threadId: string, updates: Partial<ForumThread>): Promise<void> => {
        const threads = getStoredThreads();
        const index = threads.findIndex(t => t.id === threadId);

        if (index !== -1) {
            threads[index] = { ...threads[index], ...updates, updatedAt: new Date().toISOString() };
            saveThreads(threads);
        }
    },

    /**
     * Eliminar thread
     */
    deleteThread: async (threadId: string): Promise<void> => {
        const threads = getStoredThreads();
        saveThreads(threads.filter(t => t.id !== threadId));

        // También eliminar replies
        const replies = getStoredReplies();
        saveReplies(replies.filter(r => r.threadId !== threadId));
    },

    /**
     * Incrementar vistas
     */
    incrementThreadView: async (threadId: string): Promise<void> => {
        const threads = getStoredThreads();
        const index = threads.findIndex(t => t.id === threadId);

        if (index !== -1) {
            threads[index].views = (threads[index].views || 0) + 1;
            saveThreads(threads);
        }
    },

    // === Replies ===

    /**
     * Obtener replies de un thread
     */
    getReplies: async (threadId: string): Promise<ForumReply[]> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const replies = getStoredReplies();
        return replies
            .filter(r => r.threadId === threadId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    },

    /**
     * Crear reply
     */
    createReply: async (threadId: string, replyData: Partial<ForumReply>, userId: string): Promise<ForumReply> => {
        await new Promise(resolve => setTimeout(resolve, 10));

        const replies = getStoredReplies();

        const newReply: ForumReply = {
            id: `reply-${Date.now()}`,
            threadId,
            content: replyData.content || '',
            authorId: userId,
            authorName: replyData.authorName || 'Usuario',
            authorUsername: replyData.authorUsername || 'usuario',
            authorAvatar: replyData.authorAvatar || '',
            likes: 0,
            isBestAnswer: false,
            isEdited: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        replies.push(newReply);
        saveReplies(replies);

        // Actualizar contador de replies en el thread
        const threads = getStoredThreads();
        const threadIndex = threads.findIndex(t => t.id === threadId);
        if (threadIndex !== -1) {
            threads[threadIndex].replies = (threads[threadIndex].replies || 0) + 1;
            threads[threadIndex].lastActivityAt = new Date().toISOString();
            saveThreads(threads);
        }

        return newReply;
    },

    /**
     * Eliminar reply
     */
    deleteReply: async (replyId: string): Promise<void> => {
        const replies = getStoredReplies();
        const reply = replies.find(r => r.id === replyId);

        if (reply) {
            saveReplies(replies.filter(r => r.id !== replyId));

            // Actualizar contador del thread
            const threads = getStoredThreads();
            const threadIndex = threads.findIndex(t => t.id === reply.threadId);
            if (threadIndex !== -1) {
                threads[threadIndex].replies = Math.max(0, (threads[threadIndex].replies || 1) - 1);
                saveThreads(threads);
            }
        }
    },

    // === Likes ===

    /**
     * Toggle like en thread
     */
    toggleThreadLike: async (threadId: string, userId: string): Promise<boolean> => {
        const likesKey = `latamcreativa_thread_likes_${userId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');

        const isLiked = likes.includes(threadId);

        if (isLiked) {
            localStorage.setItem(likesKey, JSON.stringify(likes.filter((id: string) => id !== threadId)));
        } else {
            likes.push(threadId);
            localStorage.setItem(likesKey, JSON.stringify(likes));
        }

        // Actualizar contador
        const threads = getStoredThreads();
        const index = threads.findIndex(t => t.id === threadId);
        if (index !== -1) {
            threads[index].likes = isLiked
                ? Math.max(0, (threads[index].likes || 1) - 1)
                : (threads[index].likes || 0) + 1;
            saveThreads(threads);
        }

        return !isLiked;
    },

    /**
     * Obtener estado de like en thread
     */
    getThreadLikeStatus: async (threadId: string, userId: string): Promise<boolean> => {
        const likesKey = `latamcreativa_thread_likes_${userId}`;
        const likes = JSON.parse(localStorage.getItem(likesKey) || '[]');
        return likes.includes(threadId);
    },

    /**
     * Listener de threads (simulado)
     */
    listenToThreads: (options: any, callback: (threads: ForumThread[]) => void) => {
        const threads = getStoredThreads();
        callback(threads);
        return () => { };
    },

    /**
     * Listener de replies (simulado)
     */
    listenToReplies: (threadId: string, callback: (replies: ForumReply[]) => void) => {
        const replies = getStoredReplies().filter(r => r.threadId === threadId);
        callback(replies);
        return () => { };
    }
};
