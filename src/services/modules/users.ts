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
    updateDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { notificationsService } from './notifications';
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
            // Add to target's followers
            await setDoc(doc(db, 'users', targetUserId, 'followers', currentUserId), {
                since: new Date().toISOString()
            });
            // Add to current's following (optional, consistent data)
            await setDoc(doc(db, 'users', currentUserId, 'following', targetUserId), {
                since: new Date().toISOString()
            });

            // Create Notification
            const currentUserProfile = await usersService.getUserProfile(currentUserId);
            if (currentUserProfile) {
                await notificationsService.createNotification(targetUserId, {
                    type: 'follow',
                    user: currentUserProfile.name || 'Usuario',
                    avatar: currentUserProfile.avatar || '',
                    content: 'comenzó a seguirte',
                    link: `/user/${encodeURIComponent(currentUserProfile.username || currentUserProfile.name)}`,
                    time: new Date().toISOString(),
                    read: false
                });
            }

        } catch (error) {
            console.error("Error subscribing:", error);
            throw error;
        }
    },

    unsubscribeFromUser: async (targetUserId: string, currentUserId: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, 'users', targetUserId, 'followers', currentUserId));
            await deleteDoc(doc(db, 'users', currentUserId, 'following', targetUserId));
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
    }
};
