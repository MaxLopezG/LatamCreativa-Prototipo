
import { 
  PORTFOLIO_ITEMS, 
  BLOG_ITEMS, 
  EDUCATION_ITEMS, 
  ASSET_ITEMS, 
  HOME_FEED_VIDEOS,
  ARTIST_DIRECTORY,
  USER_COLLECTIONS
} from '../data/content';
import { MOCK_CHATS } from '../data/chat';
import { ChatMessage, PortfolioItem, ArticleItem, CourseItem, AssetItem, VideoSuggestion, ArtistProfile } from '../types';

// Generic Delay Helper to simulate network latency
const delay = (min = 500, max = 1000) => {
  const ms = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const api = {
  // Feed & Content
  getFeed: async ({ pageParam = 0 }: { pageParam?: number } = {}): Promise<{
    portfolio: PortfolioItem[];
    blog: ArticleItem[];
    education: CourseItem[];
    assets: AssetItem[];
    videos: VideoSuggestion[];
    nextPage: number | undefined;
  }> => {
    await delay(800);
    
    // Simulate Pagination
    const PAGE_SIZE = 5;
    const start = pageParam * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    // We use Portfolio items count as the driver for pagination logic in this mock
    const hasMore = end < PORTFOLIO_ITEMS.length;

    return {
      portfolio: PORTFOLIO_ITEMS.slice(start, end),
      blog: BLOG_ITEMS.slice(0, 5), // Keep static features or slice if desired
      education: EDUCATION_ITEMS.slice(0, 4),
      assets: ASSET_ITEMS.slice(0, 5),
      videos: HOME_FEED_VIDEOS,
      nextPage: hasMore ? pageParam + 1 : undefined
    };
  },

  // User Profile
  getUserProfile: async (username: string): Promise<ArtistProfile | undefined> => {
    await delay(600);
    // Simulate finding a user, or return a default/mock for demo purposes
    const user = ARTIST_DIRECTORY.find(u => u.handle.includes(username) || u.name.includes(username));
    return user || ARTIST_DIRECTORY[0];
  },

  getArtistDirectory: async (): Promise<ArtistProfile[]> => {
    await delay(1000);
    return ARTIST_DIRECTORY;
  },

  // Chat Service
  getChatMessages: async (friendId: string): Promise<ChatMessage[]> => {
    await delay(300);
    return MOCK_CHATS[friendId] || [];
  },

  sendMessage: async ({ friendId, text }: { friendId: string; text: string }): Promise<ChatMessage> => {
    await delay(600); // Simulate network sending
    
    // Simulate failure randomly
    if (Math.random() > 0.95) {
        throw new Error('Failed to send message');
    }

    return {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },

  // Collections
  getUserCollections: async () => {
    await delay(500);
    return USER_COLLECTIONS;
  }
};
