import { projectsService } from './modules/projects';
import { blogService } from './modules/blog';
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
  ...blogService,

  // Users (Profiles & Social)
  ...usersService,

  // Notifications
  ...notificationsService,

  // Collections
  ...collectionsService
};