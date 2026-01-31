/**
 * API Service - Modo Local
 * 
 * Este archivo ahora usa servicios locales en lugar de Firebase.
 * Para reconectar Firebase, cambiar las importaciones de './local' a './modules'.
 */

// === MODO LOCAL (Sin Firebase) ===
import { localProjectsService } from './local/projects';
import { localArticlesService } from './local/articles';
import { localUsersService } from './local/users';
import { localCollectionsService } from './local/collections';

// Notificaciones locales (stub)
const localNotificationsService = {
  subscribeToNotifications: (userId: string, callback: (notifications: any[]) => void) => {
    callback([]);
    return () => { };
  },
  markNotificationRead: async () => { },
  deleteNotification: async () => { },
  markAllRead: async () => { }
};

// Re-export shared types for backward compatibility
export type { PaginatedResult } from './modules/utils';

// Aggregated API Service
// This acts as a facade, combining domain-specific services into a single access point.
export const api = {
  // Projects (Portfolio)
  ...localProjectsService,

  // Blog (Articles & Comments)
  ...localArticlesService,

  // Users (Profiles & Social)
  ...localUsersService,

  // Notifications (stub)
  ...localNotificationsService,

  // Collections
  ...localCollectionsService
};

// === MODO FIREBASE (Comentado) ===
// Para restaurar Firebase, descomenta estas líneas y comenta las de arriba:
/*
import { projectsService } from './modules/projects';
import { articlesService } from './modules/articles';
import { usersService } from './modules/users';
import { notificationsService } from './modules/notifications';
import { collectionsService } from './modules/collections';

export const api = {
  ...projectsService,
  ...articlesService,
  ...usersService,
  ...notificationsService,
  ...collectionsService
};
*/