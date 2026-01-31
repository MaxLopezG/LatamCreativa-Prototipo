/**
 * Servicio de Artículos
 * 
 * MODO LOCAL: Usa servicios locales en lugar de Firebase.
 * Para restaurar Firebase, descomenta las importaciones originales.
 * 
 * @module services/articles
 */

// === MODO LOCAL (Sin Firebase) ===
import { localArticlesService } from '../../local/articles';

/**
 * Servicio combinado - Usando servicios locales
 */
export const articlesService = {
    // Operaciones CRUD
    getArticles: localArticlesService.getArticles,
    createArticle: localArticlesService.createArticle,
    updateArticle: localArticlesService.updateArticle,
    getRecentArticles: localArticlesService.getRecentArticles,
    getUserArticles: localArticlesService.getUserArticles,
    getArticlesByCategories: async () => ({ data: [], lastDoc: null, hasMore: false }),
    getArticlesByTag: async () => ({ data: [], lastDoc: null, hasMore: false }),
    getArticlesByIds: async () => [],
    getArticle: localArticlesService.getArticle,
    getArticleBySlug: localArticlesService.getArticleBySlug,
    deleteArticle: localArticlesService.deleteArticle,
    incrementArticleViews: localArticlesService.incrementArticleView,

    // Likes
    getArticleLikeStatus: localArticlesService.getArticleLikeStatus,
    toggleArticleLike: localArticlesService.toggleArticleLike,

    // Comentarios (stubs)
    getComments: async () => [],
    listenToComments: localArticlesService.listenToComments,
    addComment: localArticlesService.addComment,
    toggleCommentLike: localArticlesService.toggleCommentLike,
    getCommentLikeStatus: localArticlesService.getCommentLikeStatus,
    getCommentsLikeStatuses: localArticlesService.getCommentsLikeStatuses,
    updateComment: async () => { },
    deleteComment: localArticlesService.deleteComment
};

// === MODO FIREBASE (Comentado) ===
/*
import { articlesCrud } from './crud';
import { articlesLikes } from './likes';
import { articlesComments } from './comments';

export const articlesService = {
    getArticles: articlesCrud.getArticles,
    createArticle: articlesCrud.createArticle,
    updateArticle: articlesCrud.updateArticle,
    getRecentArticles: articlesCrud.getRecentArticles,
    getUserArticles: articlesCrud.getUserArticles,
    getArticlesByCategories: articlesCrud.getArticlesByCategories,
    getArticlesByTag: articlesCrud.getArticlesByTag,
    getArticlesByIds: articlesCrud.getArticlesByIds,
    getArticle: articlesCrud.getArticle,
    getArticleBySlug: articlesCrud.getArticleBySlug,
    deleteArticle: articlesCrud.deleteArticle,
    incrementArticleViews: articlesCrud.incrementArticleViews,
    getArticleLikeStatus: articlesLikes.getArticleLikeStatus,
    toggleArticleLike: articlesLikes.toggleArticleLike,
    getComments: articlesComments.getComments,
    listenToComments: articlesComments.listenToComments,
    addComment: articlesComments.addComment,
    toggleCommentLike: articlesComments.toggleCommentLike,
    getCommentLikeStatus: articlesComments.getCommentLikeStatus,
    getCommentsLikeStatuses: articlesComments.getCommentsLikeStatuses,
    updateComment: articlesComments.updateComment,
    deleteComment: articlesComments.deleteComment
};

export { articlesCrud } from './crud';
export { articlesLikes } from './likes';
export { articlesComments } from './comments';
*/
