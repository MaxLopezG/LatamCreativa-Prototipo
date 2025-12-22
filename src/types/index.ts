// Types Index - Re-exports all types for backward compatibility
// This allows existing imports from '../types' to continue working

// Core type aliases
export type ItemType = 'project' | 'article' | 'portfolio' | 'course' | 'asset' | 'service' | 'job' | 'event' | 'forum' | 'collection';
export type CreateMode = 'none' | ItemType;

// Navigation Types
export * from './navigation';

// Content Types (Portfolio, Articles, Blog)
export * from './content';

// Commerce Types (Courses, Assets, Services, Sales)
export * from './commerce';

// Community Types (Groups, Events, Forum, Challenges, Jobs)
export * from './community';

// User Types (Profile, Auth, Social, Notifications)
export * from './user';

// Common Types (Collections, etc.)
export * from './common';
