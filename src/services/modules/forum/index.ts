/**
 * Forum Service - Barrel Export
 * 
 * Re-exporta todos los servicios del módulo de foro
 * para facilitar las importaciones.
 * 
 * @module services/forum
 */

import { forumThreadsCrud } from './threads';
import { forumReplies } from './replies';
import { forumModeration } from './moderation';

// Combined service object for convenience
export const forumService = {
    // Threads CRUD
    ...forumThreadsCrud,

    // Replies management
    replies: forumReplies,

    // Moderation functions
    moderation: forumModeration
};

// Individual exports for tree-shaking
export { forumThreadsCrud } from './threads';
export { forumReplies } from './replies';
export { forumModeration } from './moderation';

// Type exports
export type {
    ForumThread,
    ForumReply,
    ForumCategory,
    ForumReport,
    ForumStats,
    ForumPaginatedResult,
    CreateThreadData,
    CreateReplyData,
    ThreadSortOption,
    ReplySortOption
} from '../../../types/forum';
