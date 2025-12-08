
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartItem, Notification, CollectionItem, PortfolioItem } from '../types';
import { USER_COLLECTIONS, PORTFOLIO_ITEMS } from '../data/content';

// --- Types ---
export type CreateMode = 'none' | 'project' | 'article' | 'portfolio' | 'course' | 'asset' | 'service' | 'forum' | 'event';
export type ContentMode = 'creative' | 'dev';
export type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
  message: string;
  type: ToastType;
}

// --- Slices Types ---

interface UISlice {
  isSidebarOpen: boolean;
  activeCategory: string;
  activeModule: string;
  contentMode: ContentMode;
  createMode: CreateMode;
  searchQuery: string;
  toast: ToastState | null;
  isChatOpen: boolean;
  chatActiveUser: string | null;
  isSaveModalOpen: boolean;
  isShareModalOpen: boolean;
  itemToSave: { id: string, image: string } | null;
  viewingAuthorName: string | null;

  // Actions
  setIsSidebarOpen: (isOpen: boolean) => void;
  setActiveCategory: (category: string) => void;
  setActiveModule: (module: string) => void;
  setContentMode: (mode: ContentMode) => void;
  setCreateMode: (mode: CreateMode) => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string, type?: ToastType) => void;
  setIsChatOpen: (isOpen: boolean) => void;
  setChatActiveUser: (userId: string | null) => void;
  openSaveModal: (id: string, image: string) => void;
  closeSaveModal: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;
  setViewingAuthorName: (name: string | null) => void;
}

interface AuthSlice {
  user: { name: string; id: string; avatar: string; role: string; location: string; email?: string } | null;
  cartItems: CartItem[];
  likedItems: string[];
  createdItems: PortfolioItem[];
  notifications: Notification[];
  collections: CollectionItem[];

  // Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleLike: (itemId: string) => void;
  addCreatedItem: (item: PortfolioItem) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  saveToCollection: (collectionId: string) => void;
  createCollection: (title: string, isPrivate: boolean) => void;
  setUser: (user: AuthSlice['user']) => void;
}

// --- Combine Store ---
type AppStore = UISlice & AuthSlice;

// --- Zustand Implementation ---
const useZustandStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // UI Initial State
      isSidebarOpen: false,
      activeCategory: 'Home',
      activeModule: 'landing',
      contentMode: 'creative',
      createMode: 'none',
      searchQuery: '',
      toast: null,
      isChatOpen: false,
      chatActiveUser: null,
      isSaveModalOpen: false,
      isShareModalOpen: false,
      itemToSave: null,
      viewingAuthorName: null,

      // Auth/User Initial State
      user: null,
      cartItems: [],
      likedItems: [],
      // Initialize with some dummy created items based on existing portfolio items
      createdItems: PORTFOLIO_ITEMS.slice(0, 2).map(item => ({
        ...item,
        id: `created-${item.id}`,
        artist: 'Alex Motion',
        artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
      })),
      notifications: [
        { id: 1, type: 'comment', user: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&fit=crop', content: 'comentó en tu proyecto "Cyberpunk City"', time: 'Hace 2 min', read: false },
        { id: 2, type: 'follow', user: 'Alex Motion', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&fit=crop', content: 'comenzó a seguirte', time: 'Hace 1 hora', read: false },
        { id: 3, type: 'system', user: 'Latam Creativa', avatar: 'https://ui-avatars.com/api/?name=LC&background=F59E0B&color=fff', content: 'Tu curso "Blender 101" ha sido aprobado', time: 'Hace 3 horas', read: true },
        { id: 4, type: 'like', user: 'Diego Lopez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&fit=crop', content: 'le gustó tu artículo', time: 'Ayer', read: true },
      ],
      collections: USER_COLLECTIONS,

      // --- Actions Implementation ---

      setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setActiveModule: (module) => {
        set({ activeModule: module, viewingAuthorName: null, createMode: 'none', searchQuery: '' });
        if (window.innerWidth < 1280) set({ isSidebarOpen: false });
      },
      setContentMode: (mode) => {
        set({ contentMode: mode, activeCategory: 'Home' });
        get().showToast(mode === 'dev' ? 'Modo Desarrollador Activado 👨‍💻' : 'Modo Creativo Activado 🎨', 'info');
      },
      setCreateMode: (mode) => set({ createMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3000);
      },

      setIsChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
      setChatActiveUser: (userId) => set({ chatActiveUser: userId }),

      openSaveModal: (id, image) => set({ isSaveModalOpen: true, itemToSave: { id, image } }),
      closeSaveModal: () => set({ isSaveModalOpen: false, itemToSave: null }),

      openShareModal: () => set({ isShareModalOpen: true }),
      closeShareModal: () => set({ isShareModalOpen: false }),

      setViewingAuthorName: (name) => {
        set({ viewingAuthorName: name });
        if (window.innerWidth < 1280 && name) set({ isSidebarOpen: false });
      },

      // Auth/User Actions
      setUser: (user) => set({ user }),

      addToCart: (item) => {
        const { cartItems, showToast } = get();
        if (!cartItems.find(i => i.id === item.id)) {
          set({ cartItems: [...cartItems, item] });
          showToast(`Añadido al carrito: ${item.title}`, 'success');
        } else {
          showToast(`Este item ya está en tu carrito`, 'info');
        }
      },

      removeFromCart: (itemId) => set((state) => ({
        cartItems: state.cartItems.filter(i => i.id !== itemId)
      })),

      clearCart: () => set({ cartItems: [] }),

      toggleLike: (itemId) => set((state) => {
        const isLiked = state.likedItems.includes(itemId);
        // Optional toast
        // get().showToast(isLiked ? 'Removed from likes' : 'Added to likes', 'info');
        return {
          likedItems: isLiked
            ? state.likedItems.filter(id => id !== itemId)
            : [...state.likedItems, itemId]
        };
      }),

      addCreatedItem: (item) => set((state) => ({
        createdItems: [item, ...state.createdItems]
      })),

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),

      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),

      saveToCollection: (collectionId) => {
        const { itemToSave, showToast, closeSaveModal } = get();
        if (!itemToSave) return;

        set((state) => ({
          collections: state.collections.map(col => {
            if (col.id === collectionId) {
              return {
                ...col,
                itemCount: col.itemCount + 1,
                thumbnails: [itemToSave.image, ...col.thumbnails.slice(0, 3)]
              };
            }
            return col;
          })
        }));
        showToast("Guardado en colección", 'success');
        closeSaveModal();
      },

      createCollection: (title, isPrivate) => {
        const { itemToSave, showToast, closeSaveModal } = get();
        if (!itemToSave) return;

        const newCol: CollectionItem = {
          id: Date.now().toString(),
          title,
          isPrivate,
          itemCount: 1,
          thumbnails: [itemToSave.image]
        };

        set((state) => ({ collections: [newCol, ...state.collections] }));
        showToast("Nueva colección creada y guardada", 'success');
        closeSaveModal();
      }
    })
  )
);

// --- Adapter Hook (Facade Pattern) ---
export const useAppStore = () => {
  const store = useZustandStore();

  return {
    state: {
      isSidebarOpen: store.isSidebarOpen,
      activeCategory: store.activeCategory,
      activeModule: store.activeModule,
      viewingAuthorName: store.viewingAuthorName,
      contentMode: store.contentMode,
      createMode: store.createMode,
      searchQuery: store.searchQuery,

      // User Data
      user: store.user,
      cartItems: store.cartItems,
      likedItems: store.likedItems,
      createdItems: store.createdItems,
      collections: store.collections,
      notifications: store.notifications,

      toastMessage: store.toast?.message,
      toast: store.toast,
      isChatOpen: store.isChatOpen,
      chatActiveUser: store.chatActiveUser,

      isSaveModalOpen: store.isSaveModalOpen,
      itemToSave: store.itemToSave,
      isShareModalOpen: store.isShareModalOpen
    },
    actions: {
      setUser: store.setUser,
      setIsSidebarOpen: store.setIsSidebarOpen,
      setActiveCategory: store.setActiveCategory,
      setViewingAuthorName: store.setViewingAuthorName,
      toggleContentMode: () => store.setContentMode(store.contentMode === 'creative' ? 'dev' : 'creative'),
      setCreateMode: store.setCreateMode,
      setChatActiveUser: store.setChatActiveUser,
      setIsChatOpen: store.setIsChatOpen,
      handleModuleSelect: store.setActiveModule,
      handleSubscriptionSelect: store.setViewingAuthorName,

      // Complex Logic Mapped
      handleCreateAction: (actionId: string) => {
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
          store.setActiveModule(moduleMap[actionId]);
          store.setCreateMode(actionId as CreateMode);
        }
        store.setIsSidebarOpen(false);
      },

      handleProClick: () => {
        store.setActiveModule('pro');
        if (window.innerWidth < 1280) store.setIsSidebarOpen(false);
      },

      handleSearch: (query: string) => {
        store.setSearchQuery(query);
        store.setActiveModule('search');
      },

      addToCart: store.addToCart,
      removeFromCart: store.removeFromCart,
      clearCart: store.clearCart,
      toggleLike: store.toggleLike,
      addCreatedItem: store.addCreatedItem,

      handleBuyNow: (item: CartItem) => {
        if (!store.cartItems.find(i => i.id === item.id)) {
          store.addToCart(item);
        }
        store.setActiveModule('cart');
      },

      openChatWithUser: (userName: string) => {
        store.setIsChatOpen(true);
        store.setChatActiveUser('1'); // Mock ID
      },

      markNotificationRead: store.markNotificationRead,
      markAllNotificationsRead: store.markAllNotificationsRead,
      openSaveModal: store.openSaveModal,
      closeSaveModal: store.closeSaveModal,
      saveToCollection: store.saveToCollection,
      createCollection: store.createCollection,
      openShareModal: store.openShareModal,
      closeShareModal: store.closeShareModal,
      showToast: store.showToast
    }
  };
};
