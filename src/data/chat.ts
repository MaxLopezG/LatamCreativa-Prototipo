import { Friend, ChatMessage } from '../types';

export const FRIENDS_LIST: Friend[] = [
  {
    id: '1',
    name: 'Alex Motion',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop',
    status: 'online',
    lastMessage: '¿Viste el nuevo plugin de Blender?',
    lastMessageTime: '10:30',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop',
    status: 'busy',
    lastMessage: 'Te envío los archivos en un rato.',
    lastMessageTime: 'Ayer'
  },
  {
    id: '3',
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop',
    status: 'online',
    lastMessage: 'Gracias por el feedback!',
    lastMessageTime: 'Hace 5 min'
  },
  {
    id: '4',
    name: 'Elena Gomez',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&fit=crop',
    status: 'offline',
    lastMessage: 'Nos vemos mañana en la reunión.',
    lastMessageTime: 'Lun'
  }
];

export const MOCK_CHATS: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'Hola! ¿Cómo va ese proyecto de la ciudad cyberpunk?', timestamp: '10:28' },
    { id: 'm2', senderId: '1', text: '¿Viste el nuevo plugin de Blender?', timestamp: '10:30' },
  ],
  '2': [
    { id: 'm1', senderId: 'me', text: 'Hola Sarah, ¿tienes los renders finales?', timestamp: '09:00' },
    { id: 'm2', senderId: '2', text: 'Estoy terminando el compositing.', timestamp: '09:15' },
    { id: 'm3', senderId: '2', text: 'Te envío los archivos en un rato.', timestamp: '09:16' },
  ]
};