import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    onSnapshot,
    Unsubscribe
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Notification } from '../../types';

export const notificationsService = {
    createNotification: async (userId: string, notification: Omit<Notification, 'id'>): Promise<void> => {
        try {
            await addDoc(collection(db, 'users', userId, 'notifications'), notification);
        } catch (error) {
            console.error("Error creating notification:", error);
        }
    },

    getUserNotifications: async (userId: string): Promise<Notification[]> => {
        try {
            const q = query(collection(db, 'users', userId, 'notifications'), orderBy('time', 'desc'), limit(20));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    },

    subscribeToNotifications: (userId: string, callback: (notifications: Notification[]) => void): Unsubscribe => {
        const q = query(
            collection(db, 'users', userId, 'notifications'),
            orderBy('time', 'desc'),
            limit(20)
        );
        return onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            callback(items);
        });
    },

    markNotificationRead: async (userId: string, notificationId: string): Promise<void> => {
        try {
            const ref = doc(db, 'users', userId, 'notifications', notificationId);
            await updateDoc(ref, { read: true });
        } catch (error) {
            console.error("Error marking notification read:", error);
        }
    }
};
