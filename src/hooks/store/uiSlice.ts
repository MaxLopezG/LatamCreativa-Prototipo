/**
 * UI Slice
 * Handles user interface state: sidebar, modals, navigation, toasts
 */

import { StateCreator } from 'zustand';
import { UISlice, AppStore, ToastType, ContentMode, CreateMode, ItemType } from './types';

export const createUISlice: StateCreator<AppStore, [], [], UISlice> = (set, get) => ({
    // Initial State
    isSidebarOpen: false,
    activeCategory: 'Home',
    activeModule: 'home',
    contentMode: 'creative' as ContentMode,
    createMode: null as CreateMode,
    searchQuery: '',
    toast: null,
    isChatOpen: false,
    chatActiveUser: null,
    isSaveModalOpen: false,
    isShareModalOpen: false,
    itemToSave: null,
    viewingAuthor: null,
    subscriptionsTimestamp: 0,

    // Actions
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
        set({ activeModule: module, viewingAuthor: null, createMode: null, searchQuery: '' });
        if (typeof window !== 'undefined' && window.innerWidth < 1280) {
            set({ isSidebarOpen: false });
        }
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

    triggerSubscriptionUpdate: () => set((state) => ({
        subscriptionsTimestamp: Date.now()
    })),

    openSaveModal: (id, image, type) => set({
        isSaveModalOpen: true,
        itemToSave: { id, image, type }
    }),

    closeSaveModal: () => set({
        isSaveModalOpen: false,
        itemToSave: null
    }),

    openShareModal: () => set({ isShareModalOpen: true }),
    closeShareModal: () => set({ isShareModalOpen: false }),

    setViewingAuthor: (author) => {
        set({ viewingAuthor: author });
        if (typeof window !== 'undefined' && window.innerWidth < 1280 && author) {
            set({ isSidebarOpen: false });
        }
    },
});
