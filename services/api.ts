import { 
  PORTFOLIO_ITEMS, BLOG_ITEMS, EDUCATION_ITEMS, ASSET_ITEMS, HOME_FEED_VIDEOS, 
  ARTIST_DIRECTORY, USER_COLLECTIONS 
} from '../data/content';
import { MOCK_CHATS } from '../data/chat';
import { ChatMessage, ArtistProfile } from '../types';

const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // 1. Feed con Paginación
  getFeed: async ({ pageParam = 0 }: { pageParam?: number }) => {
    await delay();
    
    const ITEMS_PER_PAGE = 6;
    const start = pageParam * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    
    // Simulamos fin de datos
    const hasNextPage = end < PORTFOLIO_ITEMS.length;

    return {
      // El portafolio se pagina
      portfolio: PORTFOLIO_ITEMS.slice(start, end),
      // Los otros se mantienen fijos (o podrías paginarlos también)
      blog: BLOG_ITEMS.slice(0, 4),
      education: EDUCATION_ITEMS.slice(0, 4),
      assets: ASSET_ITEMS.slice(0, 5),
      videos: HOME_FEED_VIDEOS,
      nextPage: hasNextPage ? pageParam + 1 : undefined,
    };
  },

  // ... Resto de métodos igual (getUserProfile, etc.)
  getUserProfile: async (username: string): Promise<ArtistProfile | undefined> => {
    await delay(600);
    const user = ARTIST_DIRECTORY.find(u => u.handle.includes(username) || u.name.includes(username));
    return user || ARTIST_DIRECTORY[0];
  },

  getArtistDirectory: async () => { await delay(); return ARTIST_DIRECTORY; },
  getChatMessages: async (friendId: string) => { await delay(300); return MOCK_CHATS[friendId] || []; },
  
  sendMessage: async ({ friendId, text }: { friendId: string; text: string }) => {
    await delay(600);
    if (Math.random() > 0.95) throw new Error('Error de red simulado');
    return {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },

  getUserCollections: async () => { await delay(500); return USER_COLLECTIONS; }
};