/**
 * Servicio de Proyectos
 * 
 * Re-exporta todas las operaciones de proyectos desde módulos separados.
 * Mantiene compatibilidad con imports existentes.
 * 
 * @module services/projects
 */
import { projectsCrud } from './crud';
import { projectsLikes } from './likes';
import { projectsComments } from './comments';

/**
 * Servicio combinado que integra todos los sub-módulos de proyectos.
 * Mantiene la misma API que el servicio original de un solo archivo.
 */
export const projectsService = {
    // Operaciones CRUD
    createProject: projectsCrud.createProject,
    updateProject: projectsCrud.updateProject,
    deleteProject: projectsCrud.deleteProject,
    getProjects: projectsCrud.getProjects,
    getUserProjects: projectsCrud.getUserProjects,
    getProject: projectsCrud.getProject,
    getProjectsByIds: projectsCrud.getProjectsByIds,
    getRecentProjects: projectsCrud.getRecentProjects,
    listenToUserProjects: projectsCrud.listenToUserProjects,

    // Likes y Vistas
    incrementProjectView: projectsLikes.incrementProjectView,
    toggleProjectLike: projectsLikes.toggleProjectLike,
    getProjectLikeStatus: projectsLikes.getProjectLikeStatus,

    // Comentarios
    addComment: projectsComments.addComment,
    listenToComments: projectsComments.listenToComments,
    deleteComment: projectsComments.deleteComment,
    toggleCommentLike: projectsComments.toggleCommentLike,
    getCommentLikeStatus: projectsComments.getCommentLikeStatus,
    getCommentsLikeStatuses: projectsComments.getCommentsLikeStatuses,
    addCommentReply: projectsComments.addCommentReply
};

// Re-exportar sub-módulos para imports granulares si es necesario
export { projectsCrud } from './crud';
export { projectsLikes } from './likes';
export { projectsComments } from './comments';
