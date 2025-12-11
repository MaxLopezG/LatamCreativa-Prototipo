import {
    collection,
    query,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc,
    where,
    limit
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

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
    }
};
