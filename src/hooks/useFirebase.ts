/**
 * Firebase Hooks - Barrel Export
 * 
 * This file re-exports all domain-specific hooks for backward compatibility.
 * New code should import directly from the specific hook files:
 * - useProjectHooks.ts - Project/Portfolio operations
 * - useArticleHooks.ts - Blog/Article operations  
 * - useUserHooks.ts    - User/Profile operations
 * 
 * @deprecated Import from specific hook files instead for better code splitting
 */

// Project hooks
export {
    useProject,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
    useUserProjects,
    useProjectComments,
    useAddProjectComment,
    useDeleteProjectComment
} from './useProjectHooks';

// Article/Blog hooks
export {
    useArticles,
    useArticle,
    useCreateArticle,
    useUpdateArticle,
    useDeleteArticle,
    useUserArticles,
    useRecommendedArticles,
    useComments,
    useAddComment,
    useCommentActions,
    useArticleLike
} from './useArticleHooks';

// User hooks
export {
    useUserProfile,
    useAllUsers,
    useFollow,
    useSubscription // Deprecated alias, use useFollow
} from './useUserHooks';
