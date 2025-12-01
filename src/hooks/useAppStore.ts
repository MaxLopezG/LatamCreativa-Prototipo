
import { useState } from 'react';
import { CartItem, Notification } from '../types';

export type CreateMode = 'none' | 'project' | 'article' | 'portfolio' | 'course' | 'asset' | 'service' | 'forum' | 'event';
export type ContentMode = 'creative' | 'dev';

export const useAppStore = () => {
  // Navigation State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Home');
  const [viewingAuthorName, setViewingAuthorName] = useState<string | null>(null);
  
  // Content Mode State
  const [contentMode, setContentMode] = useState<ContentMode>('creative');

  // Creation Mode State
  const [createMode, setCreateMode] = useState<CreateMode>('none');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatActiveUser, setChatActiveUser] = useState<string | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'comment', user: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop', content: 'comentó en tu proyecto "Cyberpunk City"', time: 'Hace 2 min', read: false },
    { id: 2, type: 'follow', user: 'Alex Motion', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop', content: 'comenzó a seguirte', time: 'Hace 1 hora', read: false },
    { id: 3, type: 'system', user: 'Latam Creativa', avatar: 'https://ui-avatars.com/api/?name=LC&background=F59E0B&color=fff', content: 'Tu curso "Blender 101" ha sido aprobado', time: 'Hace 3 horas', read: true },
    { id: 4, type: 'like', user: 'Diego Lopez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop', content: 'le gustó tu artículo', time: 'Ayer', read: true },
  ]);

  // Actions
  const toggleContentMode = () => {
      const newMode = contentMode === 'creative' ? 'dev' : 'creative';
      setContentMode(newMode);
      setActiveCategory('Home');
      setToastMessage(newMode === 'dev' ? 'Modo Desarrollador Activado 👨‍💻' : 'Modo Creativo Activado 🎨');
      setTimeout(() => setToastMessage(null), 2000);
  };

  const handleSubscriptionSelect = (authorName: string) => {
    setViewingAuthorName(authorName);
    if (window.innerWidth < 1280) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateAction = (actionId: string) => {
    setCreateMode(actionId as CreateMode);
    setIsSidebarOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const addToCart = (item: CartItem) => {
    if (!cartItems.find(i => i.id === item.id)) {
        setCartItems(prev => [...prev, item]);
        setToastMessage(`Añadido al carrito: ${item.title}`);
        setTimeout(() => setToastMessage(null), 3000);
    } else {
        setToastMessage(`Este item ya está en tu carrito`);
        setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleBuyNow = (item: CartItem) => {
    if (!cartItems.find(i => i.id === item.id)) {
        setCartItems(prev => [...prev, item]);
    }
  };

  const openChatWithUser = (userName: string) => {
      setIsChatOpen(true);
      setChatActiveUser('1'); 
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return {
    state: {
      isSidebarOpen,
      activeCategory,
      viewingAuthorName,
      contentMode, 
      createMode,
      searchQuery,
      cartItems,
      toastMessage,
      isChatOpen,
      chatActiveUser,
      notifications
    },
    actions: {
      setIsSidebarOpen,
      setActiveCategory,
      setViewingAuthorName,
      toggleContentMode, 
      setCreateMode,
      setChatActiveUser,
      setIsChatOpen,
      handleSubscriptionSelect,
      handleCreateAction,
      handleSearch,
      addToCart,
      removeFromCart,
      handleBuyNow,
      openChatWithUser,
      markNotificationRead,
      markAllNotificationsRead
    }
  };
};
