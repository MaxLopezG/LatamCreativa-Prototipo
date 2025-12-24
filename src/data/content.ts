
import { PortfolioItem, ArticleItem, VideoSuggestion, BlogComment, CollectionItem } from '../types';

// --- PORTFOLIO DATA ---
export const PORTFOLIO_ITEMS: PortfolioItem[] = [];

// --- BLOG DATA ---
export const BLOG_ITEMS: ArticleItem[] = [];

// --- VIDEO / FEED DATA ---
export const COMMENTS: BlogComment[] = [];

export const UP_NEXT: VideoSuggestion[] = [];

export const HOME_FEED_VIDEOS: VideoSuggestion[] = [];

export const USER_COLLECTIONS: CollectionItem[] = [];

// Fallback / Content Map logic
export const CATEGORY_CONTENT_MAP: Record<string, VideoSuggestion[]> = {
  'Home': HOME_FEED_VIDEOS
};
