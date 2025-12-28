import { StateCreator } from 'zustand';
import { UISlice, AppStore, ToastType, ContentMode, CreateMode, ItemType } from './types';

// Helper to safely read from localStorage
const getSavedContentMode = (): ContentMode => {
    if (typeof window === 'undefined') return 'creative';
    try {
        const saved = localStorage.getItem('latamcreativa_content_mode');
        if (saved === 'dev' || saved === 'creative') {
            return saved;
        }
    } catch (error) {
        console.warn('Error reading content mode from localStorage:', error);
    }
    return 'creative';
};

export const createUISlice: StateCreator<AppStore, [], [], UISlice> = (set, get) => ({
    // Initial State
    isSidebarOpen: false,
    activeCategory: 'Home',
    activeModule: 'home',
    contentMode: getSavedContentMode(),
    createMode: null as CreateMode,
    searchQuery: '',
    toast: null,
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

        // Save to localStorage
        try {
            localStorage.setItem('latamcreativa_content_mode', mode);
        } catch (error) {
            console.warn('Error saving content mode to localStorage:', error);
        }

        set({ contentMode: mode, activeCategory: 'Home' });
        get().showToast(mode === 'dev' ? 'Modo Desarrollador Activado 👨‍💻' : 'Modo Creativo Activado 🎨', 'info');
    },

    setCreateMode: (mode) => set({ createMode: mode }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 3000);
    },

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
