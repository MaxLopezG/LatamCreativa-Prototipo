// src/hooks/useUserProfileData.ts
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from './useAppStore';
import { usersService } from '../services/modules/users';
import { api } from '../services/api';

export function useUserProfileData(
    author?: { name: string; avatar?: string; id?: string; role?: string; location?: string } | null,
    authorName?: string,
    options: { preventRedirect?: boolean } = {}
) {
    const { state } = useAppStore();
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [fetchedUser, setFetchedUser] = useState<any>(null);

    const isOwnProfile = useMemo(() => {
        // 1. If currently viewing /profile (no args) or /user/me
        if (!author && !authorName && (!username || username === 'me')) return true;

        // 2. If logged in, compare with current user
        if (state.user) {
            const currentName = state.user.name;
            const currentId = state.user.id;
            const currentUsername = state.user.username;

            // Check ID match (if author prop has ID)
            if (author?.id && author.id === currentId) return true;

            // Check Username match
            if (username && currentUsername && username.toLowerCase() === currentUsername.toLowerCase()) return true;

            // Check Name match (author prop, authorName prop, or URL param)
            const targetName = author?.name || authorName || (username ? decodeURIComponent(username) : '');
            if (targetName === currentName) return true;
        }

        return false;
    }, [state.user, author, authorName, username]);

    useEffect(() => {
        if (isOwnProfile && state.user?.username && !options.preventRedirect) {
            // If current 'username' param is missing OR different from actual username
            if (username !== state.user.username) {
                // Avoid redirect loop if they are equivalent
                navigate(`/user/${state.user.username}`, { replace: true });
            }
        }
    }, [isOwnProfile, state.user?.username, username, navigate]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const setupSubscription = async () => {
            // 0. If Own Profile, listen by ID from state
            if (isOwnProfile && state.user?.id) {
                unsubscribe = usersService.listenToUserProfile(state.user.id, (user) => {
                    if (user) setFetchedUser(user);
                });
                return;
            }

            // 1. Try by ID (if author prop allows)
            if (author?.id && author.id !== 'unknown') {
                unsubscribe = usersService.listenToUserProfile(author.id, (user) => {
                    if (user) setFetchedUser(user);
                });
                return;
            }

            // 2. Try by Username
            if (username) {
                unsubscribe = usersService.listenToUserProfileByUsername(username, (user) => {
                    if (user) {
                        setFetchedUser(user);
                    } else {
                        // Fallback: Try by Name (for legacy links or name-based navigation)
                        const decoded = decodeURIComponent(username);
                        usersService.getUserProfileByName(decoded).then(userByName => {
                            if (userByName) setFetchedUser(userByName);
                            else setFetchedUser(null);
                        });
                    }
                });
                return;
            }

            // 3. Fallback: Try by Name (one-time fetch)
            const targetName = author?.name || authorName || (username ? decodeURIComponent(username) : '');
            if (targetName && targetName !== 'Unknown User') {
                const cleanName = typeof targetName === 'object'
                    ? (targetName as any).name || (targetName as any).displayName || ''
                    : String(targetName);

                if (cleanName) {
                    const user = await api.getUserProfileByName(cleanName);
                    if (user) setFetchedUser(user);
                }
            }
        };

        setupSubscription();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [author?.id, author?.name, authorName, isOwnProfile, username, state.user?.id]);

    // Helper to check if a name is valid/useful
    const isValidName = (n: any) => {
        if (!n) return false;
        const s = String(n).trim();
        if (s === 'Unknown User' || s === 'unknown user' || s === 'Unknown' || s === '[object Object]') return false;
        if (s.includes('Unknown User')) return false; // Catch "Unknown User (Mock)" etc
        return true;
    };

    const getDisplayName = () => {
        // 1. Prioritize author passed prop if it's valid (Visual Consistency)
        if (author?.name && isValidName(author.name)) return author.name;

        // 2. Try fetched user name (if author prop wasn't valid)
        if (fetchedUser?.name && isValidName(fetchedUser.name)) return fetchedUser.name;

        // 3. Try other props
        if (authorName && isValidName(authorName)) return authorName;
        if (username && isValidName(username)) return username;

        return 'Unknown User';
    };

    const finalName = getDisplayName();

    // Safe user object creation
    const displayUser = isOwnProfile ? (state.user || {
        name: 'Usuario Nuevo',
        id: 'new-user',
        avatar: 'https://ui-avatars.com/api/?name=U&background=random',
        role: 'Creative Member',
        location: 'Latam',
        email: '',
        createdAt: new Date().toISOString(),
        coverImage: undefined,
        // Merge fetched stats if available to show real-time followers count
        stats: fetchedUser?.stats || state.user?.stats
    }) : {
        name: finalName,
        id: fetchedUser?.id || author?.id || 'unknown',
        avatar: fetchedUser?.avatar || author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=random&size=512`,
        role: fetchedUser?.role || fetchedUser?.profession || fetchedUser?.specialty || author?.role,
        location: fetchedUser?.location || fetchedUser?.country || fetchedUser?.city || author?.location,
        bio: fetchedUser?.bio,
        createdAt: fetchedUser?.createdAt,
        skills: fetchedUser?.skills,
        experience: fetchedUser?.experience,
        education: fetchedUser?.education,
        socialLinks: fetchedUser?.socialLinks,
        username: fetchedUser?.username,
        coverImage: fetchedUser?.coverImage,
        stats: fetchedUser?.stats,
        availableForWork: fetchedUser?.availableForWork
    };

    return {
        isOwnProfile,
        displayUser,
        fetchedUser,
        finalName
    };
}
