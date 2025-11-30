
import { useState } from 'react';
import { CartItem, Notification, CollectionItem } from '../types';
import { USER_COLLECTIONS } from '../data/content';

export type ContentMode = 'creative' | 'dev';

export const useAppStore = () => {
  // Navigation State (UI only)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Home');
  
  // Content Mode State (Creative vs Dev)
  const [contentMode, setContentMode] = useState<ContentMode>('creative');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatActiveUser, setChatActiveUser] = useState<string | null>(null);

  // Collections / Save State
  const [collections, setCollections] = useState<CollectionItem[]>(USER_COLLECTIONS);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [itemToSave, setItemToSave] = useState<{id: string, image: string} | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'comment', user: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop', content: 'comentó en tu proyecto "Cyberpunk City"', time: 'Hace 2 min', read: false },
    { id: 2, type: 'follow', user: 'Alex Motion', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop', content: 'comenzó a seguirte', time: 'Hace 1 hora', read: false },
    { id: 3, type: 'system', user: 'Latam Creativa', avatar: 'https://ui-avatars.com/api/?name=LC&background=F59E0B&color=fff', content: 'Tu curso "Blender 101" ha sido aprobado', time: 'Hace 3 horas', read: true },
    { id: 4, type: 'like', user: 'Diego Lopez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop', content: 'le gustó tu artículo', time: 'Ayer', read: true },
  ]);

  // --- Actions ---

  const toggleContentMode = () => {
      const newMode = contentMode === 'creative' ? 'dev' : 'creative';
      setContentMode(newMode);
      setActiveCategory('Home');
      setToastMessage(newMode === 'dev' ? 'Modo Desarrollador Activado 👨‍💻' : 'Modo Creativo Activado 🎨');
      setTimeout(() => setToastMessage(null), 2000);
  };

  const addToCart = (item: CartItem) => {
    // Prevent duplicates
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

      setToastMessage("Guardado en colección");
      setTimeout(() => setToastMessage(null), 3000);
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
      setToastMessage("Nueva colección creada y guardada");
      setTimeout(() => setToastMessage(null), 3000);
      closeSaveModal();
  };

  return {
    state: {
      isSidebarOpen,
      activeCategory,
      contentMode, 
      cartItems,
      toastMessage,
      isChatOpen,
      chatActiveUser,
      notifications,
      collections,
      isSaveModalOpen,
      itemToSave
    },
    actions: {
      setIsSidebarOpen,
      setActiveCategory,
      toggleContentMode, 
      setChatActiveUser,
      setIsChatOpen,
      addToCart,
      removeFromCart,
      openChatWithUser,
      markNotificationRead,
      markAllNotificationsRead,
      openSaveModal,
      closeSaveModal,
      saveToCollection,
      createCollection
    }
  };
};
