/**
 * App Store
 * Centralized Zustand store with modular slices
 * 
 * Architecture:
 * - types.ts    → Type definitions for all slices
 * - uiSlice.ts  → UI state (sidebar, modals, navigation, toasts)
 * - authSlice.ts → Auth state (user, cart, likes, notifications, collections)
 * - blogSlice.ts → Blog state (article pagination)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CartItem, CreateMode } from '../types';
import {
  AppStore,
  ContentMode,
  createUISlice,
  createAuthSlice,
  createBlogSlice
} from './store';

// --- Zustand Implementation with Modular Slices ---
const useZustandStore = create<AppStore>()(
  devtools(
    persist(
      (...a) => ({
        ...createUISlice(...a),
        ...createAuthSlice(...a),
        ...createBlogSlice(...a),
      }),
      {
        name: 'app-storage',
        version: 1,
        migrate: (persistedState: any, version: number) => {
          if (version < 1) {
            return {
              ...persistedState,
              createdItems: [],
              blogPosts: [],
              collections: [],
              cartItems: [],
              likedItems: [],
              notifications: []
            };
          }
          return persistedState;
        },
        partialize: (state) => ({
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

// --- Re-export types for convenience ---
export type { ContentMode, ToastType, ToastState } from './store/types';

// --- Adapter Hook (Facade Pattern) ---
export const useAppStore = () => {
  const store = useZustandStore();

  return {
    state: {
      // UI State
      isSidebarOpen: store.isSidebarOpen,
      activeCategory: store.activeCategory,
      activeModule: store.activeModule,
      viewingAuthor: store.viewingAuthor,
      contentMode: store.contentMode,
      createMode: store.createMode,
      searchQuery: store.searchQuery,
      toast: store.toast,
      toastMessage: store.toast?.message,
      isSaveModalOpen: store.isSaveModalOpen,
      itemToSave: store.itemToSave,
      isShareModalOpen: store.isShareModalOpen,
      subscriptionsTimestamp: store.subscriptionsTimestamp,

      // Auth State
      user: store.user,
      cartItems: store.cartItems,
      likedItems: store.likedItems,
      createdItems: store.createdItems,
      blogPosts: store.blogPosts,
      collections: store.collections,
      notifications: store.notifications,
      isLoadingAuth: store.isLoadingAuth,
      isLoadingNotifications: store.isLoadingNotifications,

      // Blog State
      blogState: store.blogState
    },
    actions: {
      // UI Actions
      setIsSidebarOpen: store.setIsSidebarOpen,
      setActiveCategory: store.setActiveCategory,
      setViewingAuthor: store.setViewingAuthor,
      setContentMode: store.setContentMode,
      toggleContentMode: () => store.setContentMode(store.contentMode === 'creative' ? 'dev' : 'creative'),
      setCreateMode: store.setCreateMode,
      handleModuleSelect: store.setActiveModule,
      handleSubscriptionSelect: (name: string) => store.setViewingAuthor(name ? { name } : null),
      openSaveModal: store.openSaveModal,
      closeSaveModal: store.closeSaveModal,
      openShareModal: store.openShareModal,
      closeShareModal: store.closeShareModal,
      triggerSubscriptionUpdate: store.triggerSubscriptionUpdate,
      triggerFollowUpdate: store.triggerSubscriptionUpdate, // Alias semántico
      showToast: store.showToast,

      // Auth Actions
      setUser: store.setUser,
      setLoadingAuth: store.setLoadingAuth,
      clearUser: store.clearUser,
      updateUserProfile: store.updateUserProfile,
      addSkill: store.addSkill,
      removeSkill: store.removeSkill,
      updateSocialLinks: store.updateSocialLinks,
      addToCart: store.addToCart,
      removeFromCart: store.removeFromCart,
      clearCart: store.clearCart,
      toggleLike: store.toggleLike,
      addCreatedItem: store.addCreatedItem,
      addBlogPost: store.addBlogPost,
      markNotificationRead: store.markNotificationRead,
      deleteNotification: store.deleteNotification,
      markAllNotificationsRead: store.markAllNotificationsRead,
      subscribeToNotifications: store.subscribeToNotifications,
      cleanupNotifications: store.cleanupNotifications,
      unsubscribeNotifications: store.unsubscribeNotifications,
      fetchCollections: store.fetchCollections,
      saveToCollection: store.saveToCollection,
      createCollection: store.createCollection,
      deleteCollection: store.deleteCollection,

      // Blog Actions
      setBlogState: store.setBlogState,
      resetBlogState: store.resetBlogState,

      // Complex Actions
      handleCreateAction: (actionId: string) => {
        if (!store.user) {
          store.showToast('Debes iniciar sesión para crear contenido', 'info');
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
        if (typeof window !== 'undefined' && window.innerWidth < 1280) {
          store.setIsSidebarOpen(false);
        }
      },

      handleSearch: (query: string) => {
        store.setSearchQuery(query);
        store.setActiveModule('search');
      },

      handleBuyNow: (item: CartItem) => {
        if (!store.cartItems.find(i => i.id === item.id)) {
          store.addToCart(item);
        }
        store.setActiveModule('cart');
      },
    }
  };
};
