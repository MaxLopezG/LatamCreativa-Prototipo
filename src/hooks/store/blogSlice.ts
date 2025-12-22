/**
 * Blog Slice
 * Handles blog article pagination state
 */

import { StateCreator } from 'zustand';
import { BlogSlice, AppStore, INITIAL_BLOG_STATE } from './types';

export const createBlogSlice: StateCreator<AppStore, [], [], BlogSlice> = (set) => ({
    // Initial State
    blogState: { ...INITIAL_BLOG_STATE },

    // Actions
    setBlogState: (updates) => set((state) => ({
        blogState: { ...state.blogState, ...updates }
    })),

    resetBlogState: () => set({
        blogState: { ...INITIAL_BLOG_STATE }
    }),
});
