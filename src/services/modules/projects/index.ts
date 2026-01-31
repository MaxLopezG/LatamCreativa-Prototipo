/**
 * Servicio de Proyectos
 * 
 * MODO LOCAL: Usa servicios locales en lugar de Firebase.
 * Para restaurar Firebase, descomenta las importaciones originales.
 * 
 * @module services/projects
 */

// === MODO LOCAL (Sin Firebase) ===
import { localProjectsService } from '../../local/projects';

/**
 * Servicio combinado - Usando servicios locales
 */
export const projectsService = {
    // Operaciones CRUD
    createProject: localProjectsService.createProject,
    updateProject: localProjectsService.updateProject,
    deleteProject: localProjectsService.deleteProject,
    getProjects: localProjectsService.getProjects,
    getUserProjects: localProjectsService.getUserProjects,
    getProject: localProjectsService.getProject,
    getProjectBySlug: localProjectsService.getProjectBySlug,
    getProjectsByIds: localProjectsService.getProjectsByIds,
    getRecentProjects: localProjectsService.getRecentProjects,
    listenToUserProjects: localProjectsService.listenToUserProjects,

    // Likes y Vistas
    incrementProjectView: localProjectsService.incrementProjectView,
    toggleProjectLike: localProjectsService.toggleProjectLike,
    getProjectLikeStatus: localProjectsService.getProjectLikeStatus,

    // Comentarios (stubs)
    addComment: localProjectsService.addComment,
    listenToComments: localProjectsService.listenToComments,
    deleteComment: localProjectsService.deleteComment,
    toggleCommentLike: localProjectsService.toggleCommentLike,
    getCommentLikeStatus: localProjectsService.getCommentLikeStatus,
    getCommentsLikeStatuses: localProjectsService.getCommentsLikeStatuses,
    addCommentReply: localProjectsService.addCommentReply
};

// === MODO FIREBASE (Comentado) ===
/*
import { projectsCrud } from './crud';
import { projectsLikes } from './likes';
import { projectsComments } from './comments';

export const projectsService = {
    createProject: projectsCrud.createProject,
    updateProject: projectsCrud.updateProject,
    deleteProject: projectsCrud.deleteProject,
    getProjects: projectsCrud.getProjects,
    getUserProjects: projectsCrud.getUserProjects,
    getProject: projectsCrud.getProject,
    getProjectBySlug: projectsCrud.getProjectBySlug,
    getProjectsByIds: projectsCrud.getProjectsByIds,
    getRecentProjects: projectsCrud.getRecentProjects,
    listenToUserProjects: projectsCrud.listenToUserProjects,
    incrementProjectView: projectsLikes.incrementProjectView,
    toggleProjectLike: projectsLikes.toggleProjectLike,
    getProjectLikeStatus: projectsLikes.getProjectLikeStatus,
    addComment: projectsComments.addComment,
    listenToComments: projectsComments.listenToComments,
    deleteComment: projectsComments.deleteComment,
    toggleCommentLike: projectsComments.toggleCommentLike,
    getCommentLikeStatus: projectsComments.getCommentLikeStatus,
    getCommentsLikeStatuses: projectsComments.getCommentsLikeStatuses,
    addCommentReply: projectsComments.addCommentReply
};

export { projectsCrud } from './crud';
export { projectsLikes } from './likes';
export { projectsComments } from './comments';
*/
