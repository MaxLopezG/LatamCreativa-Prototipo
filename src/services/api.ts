import { projectsService } from './modules/projects';
import { articlesService } from './modules/articles';
import { usersService } from './modules/users';
import { notificationsService } from './modules/notifications';
import { collectionsService } from './modules/collections';

// Re-export shared types for backward compatibility
export type { PaginatedResult } from './modules/utils';

// Aggregated API Service
// This acts as a facade, combining domain-specific services into a single access point.
export const api = {
  // Projects (Portfolio)
  ...projectsService,

  // Blog (Articles & Comments)
  ...articlesService,

  // Users (Profiles & Social)
  ...usersService,

  // Notifications
  ...notificationsService,

  // Collections
  ...collectionsService
};