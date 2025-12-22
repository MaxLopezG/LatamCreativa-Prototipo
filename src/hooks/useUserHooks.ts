/**
 * User Hooks
 * Domain-specific hooks for user profile, subscription, and admin operations
 */

import { useState, useEffect } from 'react';
import { useAppStore } from './useAppStore';
import { api } from '../services/api';
import { usersService } from '../services/modules/users';

// --- Hook for User Profile ---
export const useUserProfile = (userId: string | null) => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await usersService.getUserProfile(userId);
                setProfile(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    return { profile, loading };
};

// --- Hook for Admin: All Users ---
export const useAllUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await api.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { users, loading };
};

// --- Hook for Subscriptions (Follow/Unfollow) ---
export const useSubscription = (targetUserId: string, currentUserId: string | undefined) => {
    const { actions } = useAppStore();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Initial check and fetch count
    const init = async () => {
        if (!targetUserId) return;
        setLoading(true);
        try {
            // Check if subscribed
            if (currentUserId) {
                const subscribed = await usersService.getSubscriptionStatus(targetUserId, currentUserId);
                setIsSubscribed(subscribed);
            }

            // Fetch subscriber count
            const followers = await usersService.getFollowers(targetUserId);
            setSubscriberCount(followers.length);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
    }, [targetUserId, currentUserId]);

    const toggleSubscription = async () => {
        if (!currentUserId || !targetUserId) return;

        // Optimistic update: Store previous state for rollback
        const previousIsSubscribed = isSubscribed;
        const offset = previousIsSubscribed ? -1 : 1;

        // Update UI immediately (Optimistic)
        setIsSubscribed(!previousIsSubscribed);
        setSubscriberCount(prev => Math.max(0, prev + offset));

        try {
            if (previousIsSubscribed) {
                await usersService.unsubscribeFromUser(targetUserId, currentUserId);
            } else {
                await usersService.subscribeToUser(targetUserId, currentUserId);
            }
            // Trigger global update for sidebar
            actions.triggerSubscriptionUpdate();
        } catch (error) {
            console.error("Error toggling subscription:", error);
            // Revert state on error
            setIsSubscribed(previousIsSubscribed);
            setSubscriberCount(prev => Math.max(0, prev - offset));
        }
    };

    return { isSubscribed, loading, toggleSubscription, setSubscriberCount, subscriberCount };
};
