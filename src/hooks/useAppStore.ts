import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartItem, Notification, CollectionItem, PortfolioItem, ArticleItem } from '../types';

import { api } from '../services/api';
import { notificationsService } from '../services/modules/notifications';

export interface ExperienceItem {
  id: number | string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

export interface EducationItem {
  id: number | string;
  degree: string;
  school: string;
  period: string;
  description: string;
}

export interface SocialLinks {
  artstation?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
  website?: string;
}

export interface UserStats {
  views: number;
  likes: number;
  followers: number;
  following: number;
}

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
  subscriptionsTimestamp: number;
  triggerSubscriptionUpdate: () => void;
  chatActiveUser: string | null;
  isSaveModalOpen: boolean;
  isShareModalOpen: boolean;
  itemToSave: { id: string, image: string, type: 'project' | 'article' } | null;
  viewingAuthor: { name: string; avatar?: string; id?: string } | null;

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
  openSaveModal: (id: string, image: string, type: 'project' | 'article') => void;
  closeSaveModal: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;
  setViewingAuthor: (author: { name: string; avatar?: string; id?: string } | null) => void;
}

interface AuthSlice {
  user: {
    name: string;
    id: string;
    avatar: string;
    role: string;
    location: string;
    country?: string;
    city?: string;
    email?: string;
    bio?: string;
    experience?: ExperienceItem[];
    education?: EducationItem[];
    handle?: string;
    coverImage?: string;
    skills?: string[];
    availableForWork?: boolean;
    isPro?: boolean;
    socialLinks?: SocialLinks;
    stats?: UserStats;
    isAdmin?: boolean;
    createdAt?: string;
  } | null;
  cartItems: CartItem[];
  likedItems: string[];
  createdItems: PortfolioItem[];
  notifications: Notification[];
  collections: CollectionItem[];
  blogPosts: ArticleItem[];
  isLoadingAuth: boolean; // Add this property
  isLoadingNotifications?: boolean;

  // Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleLike: (itemId: string) => void;
  addCreatedItem: (item: PortfolioItem) => void;
  addBlogPost: (post: ArticleItem) => void;
  markNotificationRead: (id: string | number) => void;
  deleteNotification: (id: string | number) => void;
  markAllNotificationsRead: () => void;
  subscribeToNotifications: (userId: string) => void; // New Action
  cleanupNotifications: () => void; // Sync cleanup
  unsubscribeNotifications: (() => void) | null;
  fetchCollections: () => Promise<void>;
  saveToCollection: (collectionId: string) => Promise<void>;
  createCollection: (title: string, isPrivate: boolean) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  setUser: (user: AuthSlice['user']) => void;
  clearUser: () => void;
  updateUserProfile: (updates: Partial<AuthSlice['user']>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  updateSocialLinks: (links: SocialLinks) => void;
  setLoadingAuth: (loading: boolean) => void; // Add this action definition
}

// --- Blog Slice (Pagination) ---
interface BlogSlice {
  blogState: {
    articles: ArticleItem[];
    pageStack: any[]; // Store snapshots (non-serializable, so don't persist)
    currentPage: number;
    hasMore: boolean;
    loading: boolean;
    lastDoc: any | null; // Current page's last doc
    sortOption: 'recent' | 'oldest' | 'popular';
  };
  // Actions
  setBlogState: (updates: Partial<BlogSlice['blogState']>) => void;
  resetBlogState: () => void;
}

// --- Combine Store ---
type AppStore = UISlice & AuthSlice & BlogSlice;

// --- Zustand Implementation ---
const useZustandStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // UI Initial State
        isSidebarOpen: false,
        activeCategory: 'Home',
        activeModule: 'home',
        contentMode: 'creative',
        createMode: 'none',
        searchQuery: '',
        toast: null,
        isChatOpen: false,
        chatActiveUser: null,
        isSaveModalOpen: false,
        isShareModalOpen: false,
        itemToSave: null,
        viewingAuthor: null,

        // Auth/User Initial State
        user: null,
        isLoadingAuth: true,
        isLoadingNotifications: false,
        cartItems: [],
        likedItems: [],
        // Initialize with default or empty, persist will rehydrate
        createdItems: [],
        notifications: [], // Initialize empty for real data
        collections: [],
        blogPosts: [], // Initialize empty, will rely on persist or defaults if needed

        // Blog Slice Initial State
        blogState: {
          articles: [],
          pageStack: [],
          currentPage: 1,
          hasMore: true,
          loading: false,
          lastDoc: null,
          sortOption: 'recent'
        },


        // --- Actions Implementation ---

        setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
        setActiveCategory: (category) => {
          if (typeof window !== 'undefined') {
            (window as any)._debugActions = (window as any)._debugActions || [];
            (window as any)._debugActions.push({
              action: 'setActiveCategory',
              category: category,
              stack: new Error().stack
            });
          }
          set((state) => {
            const updates: any = { activeCategory: category };

            // Sync sort option with category
            if (category === 'Tendencias') {
              updates.blogState = { ...state.blogState, sortOption: 'popular' };
            } else if (category === 'Home' || category === 'Nuevos') {
              updates.blogState = { ...state.blogState, sortOption: 'recent' };
            }

            return updates;
          });
        },
        setActiveModule: (module) => {
          set({ activeModule: module, viewingAuthor: null, createMode: 'none', searchQuery: '' });
          if (window.innerWidth < 1280) set({ isSidebarOpen: false });
        },
        setContentMode: (mode) => {
          const currentMode = get().contentMode;
          const currentCategory = get().activeCategory;

          if (typeof window !== 'undefined') {
            (window as any)._debugActions = (window as any)._debugActions || [];
            (window as any)._debugActions.push({
              action: 'setContentMode',
              mode: mode,
              currentMode: currentMode,
              currentCategory: currentCategory,
              stack: new Error().stack
            });
          }

          if (currentMode === mode) return;

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

        subscriptionsTimestamp: 0,
        triggerSubscriptionUpdate: () => set((state) => ({ ...state, subscriptionsTimestamp: Date.now() })), // Added Trigger

        openSaveModal: (id, image, type) => set({ isSaveModalOpen: true, itemToSave: { id, image, type } }),
        closeSaveModal: () => set({ isSaveModalOpen: false, itemToSave: null }),

        openShareModal: () => set({ isShareModalOpen: true }),
        closeShareModal: () => set({ isShareModalOpen: false }),

        setViewingAuthor: (author) => {
          set({ viewingAuthor: author });
          if (window.innerWidth < 1280 && author) set({ isSidebarOpen: false });
        },

        // Auth/User Actions
        setUser: (user) => set({ user, isLoadingAuth: false }),
        setLoadingAuth: (loading) => set({ isLoadingAuth: loading }),

        // Blog Actions
        setBlogState: (updates) => set((state) => ({
          blogState: { ...state.blogState, ...updates }
        })),
        resetBlogState: () => set({
          blogState: {
            articles: [],
            pageStack: [],
            currentPage: 1,
            hasMore: true,
            loading: false,
            lastDoc: null,
            sortOption: 'recent'
          }
        }),


        clearUser: () => set({ user: null }),

        updateUserProfile: (updates) => set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),

        addSkill: (skill) => set((state) => {
          if (!state.user) return {};
          const currentSkills = state.user.skills || [];
          if (currentSkills.includes(skill)) return {};
          return { user: { ...state.user, skills: [...currentSkills, skill] } };
        }),

        removeSkill: (skill) => set((state) => {
          if (!state.user) return {};
          return { user: { ...state.user, skills: (state.user.skills || []).filter(s => s !== skill) } };
        }),

        updateSocialLinks: (links) => set((state) => {
          if (!state.user) return {};
          return { user: { ...state.user, socialLinks: { ...(state.user.socialLinks || {}), ...links } } };
        }),

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
          return {
            likedItems: isLiked
              ? state.likedItems.filter(id => id !== itemId)
              : [...state.likedItems, itemId]
          };
        }),

        addCreatedItem: (item) => set((state) => ({
          createdItems: [item, ...state.createdItems]
        })),

        addBlogPost: (post) => set((state) => ({
          blogPosts: [post, ...state.blogPosts]
        })),

        markNotificationRead: async (id) => {
          const { user } = get();
          if (user) await api.markNotificationRead(user.id, id.toString());
          set((state) => ({
            notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
          }));
        },

        deleteNotification: async (id) => {
          const { user } = get();
          if (!user) return;
          // Optimistic update
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
          await notificationsService.deleteNotification(user.id, String(id));
        },

        markAllNotificationsRead: () => set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        })),

        // Real-time subscription
        subscribeToNotifications: (userId: string) => {
          // Cleanup previous if exists
          const { unsubscribeNotifications } = get();
          if (unsubscribeNotifications) {
            unsubscribeNotifications();
          }

          set({ isLoadingNotifications: true });

          const unsubscribe = api.subscribeToNotifications(userId, (notifications) => {
            set({ notifications, isLoadingNotifications: false });
          });

          set({ unsubscribeNotifications: unsubscribe });
        },

        unsubscribeNotifications: null, // Initial state placeholder

        cleanupNotifications: () => {
          const { unsubscribeNotifications } = get();
          if (unsubscribeNotifications) unsubscribeNotifications();
          set({ unsubscribeNotifications: null, notifications: [] });
        },


        fetchCollections: async () => {
          const { user } = get();
          if (!user) return;
          const collections = await api.getUserCollections(user.id);
          set({ collections });
        },

        saveToCollection: async (collectionId) => {
          const { itemToSave, showToast, closeSaveModal, user } = get();
          if (!itemToSave || !user) return;

          try {
            const sanitizedItem = {
              id: String(itemToSave.id),
              type: itemToSave.type || (itemToSave.type === 'article' ? 'article' : 'project'),
              image: String(itemToSave.image || ''),
            };

            await api.addToCollection(user.id, collectionId, sanitizedItem as any);

            set((state) => ({
              collections: state.collections.map(col => {
                if (col.id === collectionId) {
                  return {
                    ...col,
                    itemCount: (col.itemCount || 0) + 1,
                    thumbnails: [itemToSave.image, ...(col.thumbnails || []).slice(0, 3)],
                    items: [...(col.items || []), { id: itemToSave.id, type: itemToSave.type || 'project', addedAt: new Date().toISOString() }]
                  };
                }
                return col;
              })
            }));
            showToast("Guardado en colección", 'success');
            closeSaveModal();
          } catch (error) {
            console.error(error);
            showToast("Error al guardar", 'error');
          }
        },

        createCollection: async (title, isPrivate) => {
          const { itemToSave, showToast, closeSaveModal, user } = get();
          if (!user) return;

          try {
            // Create empty collection
            console.log("Action: Creating collection...", { title, isPrivate, userId: user.id });
            const newCol = await api.createCollection(user.id, title, isPrivate);

            if (newCol) {
              console.log("Action: Collection created, checking itemToSave:", itemToSave);
              // If there's an item to save, add it immediately
              if (itemToSave) {
                console.log("Action: Adding item to new collection...", itemToSave);

                // Sanitize the item to ensure no custom objects or undefined values are passed to Firestore
                const sanitizedItem = {
                  id: String(itemToSave.id),
                  type: itemToSave.type || (itemToSave.type === 'article' ? 'article' : 'project'),
                  image: String(itemToSave.image || ''),
                  addedAt: new Date().toISOString()
                };

                // The service expects the reference object now
                await api.addToCollection(user.id, newCol.id, sanitizedItem as any);

                // Update local object to reflect the change immediately
                newCol.itemCount = 1;
                newCol.thumbnails = [sanitizedItem.image];
                newCol.items = [sanitizedItem as any];
              }

              set((state) => ({ collections: [newCol, ...state.collections] }));
              showToast("Colección creada correctamente", 'success');
              closeSaveModal();
            }
          } catch (error) {
            console.error("Action Error [createCollection]:", error);
            showToast("Error al crear colección", 'error');
          }
        },

        deleteCollection: async (collectionId) => {
          const { user, showToast } = get();
          if (!user) return;
          try {
            await api.deleteCollection(user.id, collectionId);
            set((state) => ({
              collections: state.collections.filter(c => c.id !== collectionId)
            }));
            showToast("Colección eliminada", 'success');
          } catch (error) {
            console.error("Action error:", error);
            showToast("Error al eliminar colección", 'error');
          }
        }
      }),
      {
        name: 'app-storage', // name of the item in the storage (must be unique)
        partialize: (state) => ({
          // Select which fields to persist
          user: state.user,
          createdItems: state.createdItems,
          blogPosts: state.blogPosts,
          cartItems: state.cartItems,
          likedItems: state.likedItems,
          collections: state.collections,
          contentMode: state.contentMode,
          notifications: state.notifications
        }),
      }
    )
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
      viewingAuthor: store.viewingAuthor,
      contentMode: store.contentMode,
      createMode: store.createMode,
      searchQuery: store.searchQuery,

      // User Data
      user: store.user,
      cartItems: store.cartItems,
      likedItems: store.likedItems,
      createdItems: store.createdItems,
      blogPosts: store.blogPosts,
      collections: store.collections,
      notifications: store.notifications,

      toastMessage: store.toast?.message,
      toast: store.toast,
      isChatOpen: store.isChatOpen,
      chatActiveUser: store.chatActiveUser,

      isSaveModalOpen: store.isSaveModalOpen,
      itemToSave: store.itemToSave,
      isShareModalOpen: store.isShareModalOpen,
      subscriptionsTimestamp: store.subscriptionsTimestamp, // Expose timestamp
      isLoadingAuth: store.isLoadingAuth,
      isLoadingNotifications: store.isLoadingNotifications,

      // Blog State
      blogState: store.blogState
    },
    actions: {
      setUser: store.setUser,
      setLoadingAuth: store.setLoadingAuth, // Expose action
      // ...
      setBlogState: store.setBlogState,
      resetBlogState: store.resetBlogState,
      clearUser: store.clearUser,
      updateUserProfile: store.updateUserProfile,
      addSkill: store.addSkill,
      removeSkill: store.removeSkill,
      updateSocialLinks: store.updateSocialLinks,
      setIsSidebarOpen: store.setIsSidebarOpen,
      setActiveCategory: store.setActiveCategory,
      setViewingAuthor: store.setViewingAuthor,

      setContentMode: store.setContentMode,
      toggleContentMode: () => store.setContentMode(store.contentMode === 'creative' ? 'dev' : 'creative'),
      setCreateMode: store.setCreateMode,
      setChatActiveUser: store.setChatActiveUser,
      setIsChatOpen: store.setIsChatOpen,
      handleModuleSelect: store.setActiveModule,
      handleSubscriptionSelect: (name: string) => store.setViewingAuthor(name ? { name } : null),

      // Complex Logic Mapped
      handleCreateAction: (actionId: string) => {
        // AUTH GUARD: Check if user is logged in
        if (!store.user) {
          store.showToast('Debes iniciar sesión para crear contenido', 'info');
          // Navigate to auth? We don't have navigate here easily without injection.
          // BUT MainLayout uses this action.
          // Ideally, we rely on the component using this to handle nav, OR we update activeModule to 'auth'?
          // Let's set activeModule to 'auth' which MainLayout listens to but doesn't auto-redirect to /auth route unless mapped.
          // Correction: MainLayout maps 'home'->'/', 'learning'->'/education'. It defaults other modules to `/${moduleId}`.
          // So setting activeModule = 'auth' -> navigates to '/auth'.

          store.setActiveModule('auth');
          store.setIsSidebarOpen(false);
          return;
        }

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
      addBlogPost: store.addBlogPost,

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
      subscribeToNotifications: store.subscribeToNotifications,
      cleanupNotifications: store.cleanupNotifications,
      unsubscribeNotifications: store.unsubscribeNotifications,
      openSaveModal: store.openSaveModal,
      closeSaveModal: store.closeSaveModal,
      saveToCollection: store.saveToCollection,
      createCollection: store.createCollection,
      deleteCollection: store.deleteCollection,
      fetchCollections: store.fetchCollections,
      openShareModal: store.openShareModal,
      closeShareModal: store.closeShareModal,
      triggerSubscriptionUpdate: store.triggerSubscriptionUpdate, // Expose action
      deleteNotification: store.deleteNotification, // Expose action
      showToast: store.showToast
    }
  };
};
