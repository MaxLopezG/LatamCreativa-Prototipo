
import { PortfolioItem, ArticleItem, VideoSuggestion, BlogComment, CourseItem, AssetItem, CommunityGroup, FreelanceServiceItem, MembershipTier, ForumPost, EventItem, ArtistProfile, ChallengeItem, JobItem, CollectionItem } from '../types';

// --- JOB LISTINGS ---
export const JOB_ITEMS: JobItem[] = [];

// --- CHALLENGES ---
export const CHALLENGE_ITEMS: ChallengeItem[] = [];

// --- ARTIST DIRECTORY DATA ---
export const ARTIST_DIRECTORY: ArtistProfile[] = [];

// --- EVENT DATA ---
export const EVENT_ITEMS: EventItem[] = [];

// --- MEMBERSHIP TIERS ---
export const ARTIST_TIERS: MembershipTier[] = [];

// --- FORUM DATA ---
export const FORUM_ITEMS: ForumPost[] = [];

// --- FREELANCE SERVICES DATA ---
export const FREELANCE_SERVICES: FreelanceServiceItem[] = [];

// --- COMMUNITY GROUPS DATA ---
export const COMMUNITY_GROUPS: CommunityGroup[] = [];

// --- ASSET MARKET DATA ---
export const ASSET_ITEMS: AssetItem[] = [];

// --- PORTFOLIO DATA ---
export const PORTFOLIO_ITEMS: PortfolioItem[] = [];

// --- BLOG DATA ---
export const BLOG_ITEMS: ArticleItem[] = [];

// --- EDUCATION DATA ---
export const EDUCATION_ITEMS: CourseItem[] = [];

// --- VIDEO / FEED DATA ---
export const COMMENTS: BlogComment[] = [];

export const UP_NEXT: VideoSuggestion[] = [];

export const HOME_FEED_VIDEOS: VideoSuggestion[] = [];

export const USER_COLLECTIONS: CollectionItem[] = [];

// Fallback / Content Map logic
export const CATEGORY_CONTENT_MAP: Record<string, VideoSuggestion[]> = {
  'Home': HOME_FEED_VIDEOS
};
