// Content Types - Portfolio, Articles, Blog

export interface PortfolioItem {
    id: string;
    title: string;
    artist: string;
    /** Primary owner identifier - use this for all new code */
    authorId: string;
    /** @deprecated Use authorId instead. Kept for backward compatibility with existing data. */
    artistId?: string;
    artistAvatar?: string;
    artistHeadline?: string;
    artistRole?: string;
    artistUsername?: string;
    location?: string;
    image: string;
    views: string;
    likes: string;
    category: string;
    isExclusive?: boolean;
    isPrivate?: boolean;
    description?: string;
    images?: string[];
    gallery?: {
        url: string;
        caption: string;
        type?: 'image' | 'video' | 'youtube' | 'sketchfab';
    }[];
    software?: string[];
    domain?: 'creative' | 'dev';
    createdAt?: string;
    /** Project publication status */
    status?: 'draft' | 'published' | 'scheduled';
    /** ISO date string for scheduled publication */
    scheduledAt?: string;
}

export interface ArticleItem {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    author: string;
    authorId: string;
    authorAvatar: string;
    date: string;
    readTime: string;
    category: string;
    likes: number;
    comments: number;
    isExclusive?: boolean;
    content?: string;
    domain?: 'creative' | 'dev';
    role?: string;
    tags?: string[];
    /** Article publication status */
    status?: 'draft' | 'published' | 'scheduled';
    /** ISO date string for scheduled publication */
    scheduledAt?: string;
    /** View count */
    views?: number;
}

export interface BlogComment {
    id: string;
    author: string;
    authorId?: string;
    avatar: string;
    content: string;
    date: string;
    timeAgo: string;
    likes: number;
    parentId?: string;
    replies?: BlogComment[];
}

export interface VideoSuggestion {
    id: string;
    title: string;
    channel: string;
    views: string;
    timeAgo: string;
    duration: string;
    thumbnail: string;
}

export interface VideoPageData {
    title: string;
    channelName: string;
    channelAvatar: string;
    subscribers: string;
    views: string;
    timeAgo: string;
    description: string;
    thumbnail: string;
    videoUrl?: string;
    likes: string;
    isLiked?: boolean;
}
