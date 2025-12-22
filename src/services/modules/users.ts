import {
    collection,
    query,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    where,
    limit,
    updateDoc,
    increment,
    onSnapshot,
    addDoc,
    writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { User } from '../../types';

export const usersService = {
    getUserProfile: async (userId: string): Promise<any> => {
        try {
            if (!userId) return null;
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    updateUserProfile: async (userId: string, data: any): Promise<void> => {
        try {
            const userRef = doc(db, 'users', userId);

            // Recursive function to remove undefined values
            const sanitizeData = (obj: any): any => {
                if (Array.isArray(obj)) {
                    return obj.map(v => sanitizeData(v)).filter(v => v !== undefined);
                }
                if (obj !== null && typeof obj === 'object') {
                    return Object.entries(obj).reduce((acc, [key, value]) => {
                        const sanitizedValue = sanitizeData(value);
                        if (sanitizedValue !== undefined) {
                            acc[key] = sanitizedValue;
                        }
                        return acc;
                    }, {} as any);
                }
                return obj;
            };

            const sanitizedData = sanitizeData(data);

            await updateDoc(userRef, sanitizedData);
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },

    /**
     * Ensures a user profile exists in Firestore.
     * Use this for Google Auth or App.tsx initialization to prevent overwriting existing data.
     * @param user Firebase Auth User object
     * @param additionalData Optional data to merge if creating a NEW document
     */
    initializeUserProfile: async (user: any, additionalData: any = {}): Promise<any> => {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return { id: userSnap.id, ...userSnap.data() };
            }

            // Create new profile
            const newUser = {
                name: additionalData.name || user.displayName || 'Usuario',
                email: user.email || '',
                avatar: additionalData.avatar || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}`,
                role: 'Creative Member',
                location: 'Latam',
                firstName: additionalData.firstName || '',
                lastName: additionalData.lastName || '',
                country: additionalData.country || '',
                city: additionalData.city || '',
                isProfileComplete: false, // Explicit flag for onboarding
                createdAt: new Date().toISOString(),
                ...additionalData
            };

            // Remove undefined fields
            Object.keys(newUser).forEach(key => newUser[key] === undefined && delete newUser[key]);

            await setDoc(userRef, newUser);
            return { id: user.uid, ...newUser };
        } catch (error) {
            console.error("Error initializing user profile:", error);
            throw error;
        }
    },

    getUserProfileByUsername: async (username: string) => {
        try {
            if (!username) return null;
            const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile by username:', error);
            return null;
        }
    },

    checkUsernameAvailability: async (username: string): Promise<boolean> => {
        try {
            if (!username) return false;
            const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
            const querySnapshot = await getDocs(q);
            return querySnapshot.empty;
        } catch (error) {
            console.error("Error checking username availability:", error);
            return false;
        }
    },

    listenToUserProfile: (userId: string, callback: (user: any) => void) => {
        if (!userId) return () => { };
        const docRef = doc(db, 'users', userId);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({ id: docSnap.id, ...docSnap.data() });
            } else {
                callback(null);
            }
        });
    },

    listenToUserProfileByUsername: (username: string, callback: (user: any) => void) => {
        if (!username) return () => { };
        const q = query(collection(db, 'users'), where('username', '==', username), limit(1));
        return onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                callback({ id: doc.id, ...doc.data() });
            } else {
                callback(null);
            }
        });
    },

    getUserProfileByName: async (name: string) => {
        try {
            if (!name || name === 'Unknown User') return null;
            const q = query(collection(db, 'users'), where('name', '==', name), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile by name:', error);
            return null;
        }
    },

    getAllUsers: async (): Promise<any[]> => {
        try {
            const q = query(collection(db, 'users'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    },

    getFollowers: async (userId: string): Promise<string[]> => {
        try {
            const followersRef = collection(db, 'users', userId, 'followers');
            const snapshot = await getDocs(followersRef);
            return snapshot.docs.map(doc => doc.id);
        } catch (error) {
            console.error("Error fetching followers:", error);
            return [];
        }
    },

    getFollowing: async (userId: string): Promise<string[]> => {
        try {
            const followingRef = collection(db, 'users', userId, 'following');
            const snapshot = await getDocs(followingRef);
            return snapshot.docs.map(doc => doc.id);
        } catch (error) {
            console.error("Error fetching following:", error);
            return [];
        }
    },

    subscribeToUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        try {
            // Fetch current user profile to store rich data
            const currentUserProfile = await usersService.getUserProfile(currentUserId);
            // Fetch target user profile to store rich data in "following" (optional but good for symmetry)
            // For now, we prioritize the "Follower" info as requested.

            const followerData = {
                since: new Date().toISOString(),
                followerId: currentUserId,
                followerName: currentUserProfile?.name || 'Usuario',
                followerUsername: currentUserProfile?.username || '',
                followerAvatar: currentUserProfile?.avatar || ''
            };

            const batch = writeBatch(db);

            // Add to target's followers with RICH DATA
            const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
            batch.set(followerRef, followerData);

            // Add to current's following
            const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
            batch.set(followingRef, {
                since: new Date().toISOString(),
                followingId: targetUserId
            });

            // Update Counters (Atomic Increment)
            const targetUserRef = doc(db, 'users', targetUserId);
            batch.update(targetUserRef, {
                'stats.followers': increment(1)
            });

            const currentUserRef = doc(db, 'users', currentUserId);
            batch.update(currentUserRef, {
                'stats.following': increment(1)
            });

            await batch.commit();

            // Create Notification for the target user
            // We do this AFTER the batch to ensure consistency, but failures here won't rollback the follow
            try {
                await addDoc(collection(db, 'users', targetUserId, 'notifications'), {
                    type: 'follow',
                    user: currentUserProfile?.name || 'Alguien',
                    avatar: currentUserProfile?.avatar || '',
                    content: 'ha comenzado a seguirte',
                    time: new Date().toISOString(),
                    read: false,
                    link: `/profile/${currentUserId}` // Link to the follower's profile
                });
            } catch (notifError) {
                console.error("Error sending follow notification:", notifError);
            }

        } catch (error) {
            console.error("Error subscribing:", error);
            throw error;
        }
    },

    unsubscribeFromUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        try {
            const batch = writeBatch(db);

            const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
            batch.delete(followerRef);

            const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
            batch.delete(followingRef);

            // Update Counters (Atomic Decrement)
            const targetUserRef = doc(db, 'users', targetUserId);
            batch.update(targetUserRef, {
                'stats.followers': increment(-1)
            });

            const currentUserRef = doc(db, 'users', currentUserId);
            batch.update(currentUserRef, {
                'stats.following': increment(-1)
            });

            await batch.commit();
        } catch (error) {
            console.error("Error unsubscribing:", error);
            throw error;
        }
    },

    getSubscriptionStatus: async (targetUserId: string, currentUserId: string): Promise<boolean> => {
        try {
            const docRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
            const snap = await getDoc(docRef);
            return snap.exists();
        } catch (error) {
            console.error("Error checking subscription:", error);
            return false;
        }
    },

    // --- Chat Methods (Mock/Placeholder) ---
    getChatMessages: async (friendId: string): Promise<any[]> => {
        // Return empty array or mock data for now
        return [];
    },

    sendMessage: async ({ friendId, text }: { friendId: string, text: string }): Promise<void> => {

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
    },

    getArtistDirectory: async (): Promise<any[]> => {

        return [];
    },

    /**
     * Increment the view count on a user's profile
     * Should be called when someone visits a profile (not own profile)
     */
    incrementProfileViews: async (userId: string): Promise<void> => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                'stats.views': increment(1)
            });
        } catch (error) {
            console.error("Error incrementing profile views:", error);
            // Don't throw - this is non-critical
        }
    },

    /**
     * Calculate total likes across all user's projects
     * Returns the sum of likes from all projects by this user
     */
    getTotalProjectLikes: async (userId: string): Promise<number> => {
        try {
            const projectsQuery = query(
                collection(db, 'projects'),
                where('authorId', '==', userId)
            );

            const snapshot = await getDocs(projectsQuery);
            let totalLikes = 0;

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                totalLikes += Number(data.likes || 0) + Number(data.stats?.likeCount || 0);
            });

            return totalLikes;
        } catch (error) {
            console.error("Error calculating total project likes:", error);
            return 0;
        }
    }
};
