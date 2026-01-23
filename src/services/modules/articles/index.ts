/**
 * Servicio de Artículos
 * 
 * Re-exporta todas las operaciones de artículos desde módulos separados.
 * Mantiene compatibilidad con imports existentes.
 * 
 * @module services/articles
 */
import { articlesCrud } from './crud';
import { articlesLikes } from './likes';
import { articlesComments } from './comments';

/**
 * Servicio combinado que integra todos los sub-módulos de artículos
 */
export const articlesService = {
    // Operaciones CRUD
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

    // Likes
    getArticleLikeStatus: articlesLikes.getArticleLikeStatus,
    toggleArticleLike: articlesLikes.toggleArticleLike,

    // Comentarios
    getComments: articlesComments.getComments,
    listenToComments: articlesComments.listenToComments,
    addComment: articlesComments.addComment,
    toggleCommentLike: articlesComments.toggleCommentLike,
    getCommentLikeStatus: articlesComments.getCommentLikeStatus,
    getCommentsLikeStatuses: articlesComments.getCommentsLikeStatuses,
    updateComment: articlesComments.updateComment,
    deleteComment: articlesComments.deleteComment
};

// Re-exportar sub-módulos para imports granulares si es necesario
export { articlesCrud } from './crud';
export { articlesLikes } from './likes';
export { articlesComments } from './comments';
