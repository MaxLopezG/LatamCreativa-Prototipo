/**
 * Servicios Locales - Índice Central
 * Exporta todos los servicios locales para reemplazar Firebase
 */

export { localAuthService } from './auth';
export { localProjectsService } from './projects';
export { localArticlesService } from './articles';
export { localUsersService } from './users';
export { localForumService } from './forum';
export { localCollectionsService } from './collections';
export { localStorageService } from './storage';

// Re-exportar servicios con alias para compatibilidad
import { localProjectsService } from './projects';
import { localArticlesService } from './articles';
import { localUsersService } from './users';
import { localCollectionsService } from './collections';
import { localStorageService } from './storage';

// Alias para mantener compatibilidad con la API existente
export const projectsService = localProjectsService;
export const articlesService = localArticlesService;
export const usersService = localUsersService;
export const collectionsService = localCollectionsService;
export const storageService = localStorageService;
