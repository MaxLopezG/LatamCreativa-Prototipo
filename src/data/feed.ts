
import { Comment, VideoSuggestion } from '../types';

export const COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    content: "Excelente tutorial.",
    timeAgo: '2d',
    likes: 24
  }
];

export const UP_NEXT: VideoSuggestion[] = [];
export const HOME_FEED_VIDEOS: VideoSuggestion[] = [
    { id: 'h1', title: 'UE5 Lighting', channel: 'Unreal Sensei', views: '250K', timeAgo: '1d', duration: '24:12', thumbnail: 'https://images.unsplash.com/photo-1616428330761-d7037f4044a8?q=80&w=400&fit=crop' }
];

export const CATEGORY_CONTENT_MAP: Record<string, VideoSuggestion[]> = {
  'Home': HOME_FEED_VIDEOS
};
