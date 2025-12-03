
import { useState } from 'react';
import { CartItem, Notification, CollectionItem } from '../types';
import { USER_COLLECTIONS } from '../data/content';

export type CreateMode = 'none' | 'project' | 'article' | 'portfolio' | 'course' | 'asset' | 'service' | 'forum' | 'event';
export type ContentMode = 'creative' | 'dev';
export type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
  message: string;
  type: ToastType;
}

export const useAppStore = () => {
  // Navigation State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Home');
  const [activeModule, setActiveModule] = useState('landing');
  const [viewingAuthorName, setViewingAuthorName] = useState<string | null>(null);
  
  // Content Mode State (Creative vs Dev)
  const [contentMode, setContentMode] = useState<ContentMode>('creative');

  // Creation Mode State
  const [createMode, setCreateMode] = useState<CreateMode>('none');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Enhanced Toast State
  const [toast, setToast] = useState<ToastState | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatActiveUser, setChatActiveUser] = useState<string | null>(null);

  // Collections / Save State
  const [collections, setCollections] = useState<CollectionItem[]>(USER_COLLECTIONS);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [itemToSave, setItemToSave] = useState<{id: string, image: string} | null>(null);

  // Share State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'comment', user: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop', content: 'comentó en tu proyecto "Cyberpunk City"', time: 'Hace 2 min', read: false },
    { id: 2, type: 'follow', user: 'Alex Motion', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop', content: 'comenzó a seguirte', time: 'Hace 1 hora', read: false },
    { id: 3, type: 'system', user: 'Latam Creativa', avatar: 'https://ui-avatars.com/api/?name=LC&background=F59E0B&color=fff', content: 'Tu curso "Blender 101" ha sido aprobado', time: 'Hace 3 horas', read: true },
    { id: 4, type: 'like', user: 'Diego Lopez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop', content: 'le gustó tu artículo', time: 'Ayer', read: true },
  ]);

  // --- Actions ---

  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId);
    setViewingAuthorName(null);
    setCreateMode('none');
    setSearchQuery('');
    
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1280) {
        setIsSidebarOpen(false);
    }
  };

  const showToast = (message: string, type: ToastType = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
  };

  const toggleContentMode = () => {
      const newMode = contentMode === 'creative' ? 'dev' : 'creative';
      setContentMode(newMode);
      setActiveCategory('Home');
      showToast(newMode === 'dev' ? 'Modo Desarrollador Activado 👨‍💻' : 'Modo Creativo Activado 🎨', 'info');
  };

  const handleSubscriptionSelect = (authorName: string) => {
    setViewingAuthorName(authorName);
    if (window.innerWidth < 1280) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateAction = (actionId: string) => {
    const moduleMap: Record<string, string> = {
      project: 'community',
      article: 'blog',
      portfolio: 'portfolio',
      course: 'education',
      asset: 'market',
      service: 'freelance',
      forum: 'forum',
      event: 'events'
    };

    if (moduleMap[actionId]) {
      setActiveModule(moduleMap[actionId]);
      setCreateMode(actionId as CreateMode);
    }
    
    setIsSidebarOpen(false);
  };

  const handleProClick = () => {
    setActiveModule('pro');
    if (window.innerWidth < 1280) {
      setIsSidebarOpen(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveModule('search');
  };

  const addToCart = (item: CartItem) => {
    // Prevent duplicates
    if (!cartItems.find(i => i.id === item.id)) {
        setCartItems(prev => [...prev, item]);
        showToast(`Añadido al carrito: ${item.title}`, 'success');
    } else {
        showToast(`Este item ya está en tu carrito`, 'info');
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleBuyNow = (item: CartItem) => {
    if (!cartItems.find(i => i.id === item.id)) {
        setCartItems(prev => [...prev, item]);
    }
    setActiveModule('cart');
  };

  const openChatWithUser = (userName: string) => {
      setIsChatOpen(true);
      setChatActiveUser('1'); // Mock ID
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // --- Collection Actions ---
  const openSaveModal = (id: string, image: string) => {
      setItemToSave({ id, image });
      setIsSaveModalOpen(true);
  };

  const closeSaveModal = () => {
      setIsSaveModalOpen(false);
      setItemToSave(null);
  };

  const saveToCollection = (collectionId: string) => {
      if (!itemToSave) return;
      
      // Update collection with new item (mock logic)
      setCollections(prev => prev.map(col => {
          if (col.id === collectionId) {
              return {
                  ...col,
                  itemCount: col.itemCount + 1,
                  thumbnails: [itemToSave.image, ...col.thumbnails.slice(0, 3)]
              };
          }
          return col;
      }));

      showToast("Guardado en colección", 'success');
      closeSaveModal();
  };

  const createCollection = (title: string, isPrivate: boolean) => {
      if (!itemToSave) return;

      const newCol: CollectionItem = {
          id: Date.now().toString(),
          title,
          isPrivate,
          itemCount: 1,
          thumbnails: [itemToSave.image]
      };

      setCollections(prev => [newCol, ...prev]);
      showToast("Nueva colección creada y guardada", 'success');
      closeSaveModal();
  };

  // --- Share Actions ---
  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  return {
    state: {
      isSidebarOpen,
      activeCategory,
      activeModule,
      viewingAuthorName,
      contentMode,
      createMode,
      searchQuery,
      cartItems,
      toastMessage: toast?.message, // Backward compatibility
      toast,
      isChatOpen,
      chatActiveUser,
      notifications,
      collections,
      isSaveModalOpen,
      itemToSave,
      isShareModalOpen
    },
    actions: {
      setIsSidebarOpen,
      setActiveCategory,
      setViewingAuthorName,
      toggleContentMode,
      setCreateMode,
      setChatActiveUser,
      setIsChatOpen,
      handleModuleSelect,
      handleSubscriptionSelect,
      handleCreateAction,
      handleProClick,
      handleSearch,
      addToCart,
      removeFromCart,
      handleBuyNow,
      openChatWithUser,
      markNotificationRead,
      markAllNotificationsRead,
      openSaveModal,
      closeSaveModal,
      saveToCollection,
      createCollection,
      openShareModal,
      closeShareModal,
      showToast
    }
  };
};
