/**
 * Forum Moderation Functions
 * 
 * Módulo que maneja las funciones de moderación del foro:
 * fijar/desfijar hilos, cerrar/abrir hilos, reportar contenido.
 * 
 * @module services/forum/moderation
 */
import {
    doc,
    updateDoc,
    addDoc,
    collection,
    getDocs,
    query,
    where,
    getCountFromServer
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ForumReport, ReportReason, ForumStats } from '../../../types/forum';
import { sanitizeData } from '../utils';

const THREADS_COLLECTION = 'forumThreads';
const REPORTS_COLLECTION = 'forumReports';

export const forumModeration = {
    /**
     * Fija o desfija un hilo (solo para admins/moderadores).
     */
    async pinThread(threadId: string, isPinned: boolean): Promise<void> {
        try {
            const threadRef = doc(db, THREADS_COLLECTION, threadId);
            await updateDoc(threadRef, { isPinned });
        } catch (error) {
            console.error('Error pinning thread:', error);
            throw error;
        }
    },

    /**
     * Cierra o abre un hilo (evita nuevas respuestas).
     */
    async closeThread(threadId: string, isClosed: boolean): Promise<void> {
        try {
            const threadRef = doc(db, THREADS_COLLECTION, threadId);
            await updateDoc(threadRef, { isClosed });
        } catch (error) {
            console.error('Error closing thread:', error);
            throw error;
        }
    },

    /**
     * Marca un hilo como resuelto.
     */
    async markResolved(threadId: string, isResolved: boolean): Promise<void> {
        try {
            const threadRef = doc(db, THREADS_COLLECTION, threadId);
            await updateDoc(threadRef, { isResolved });
        } catch (error) {
            console.error('Error marking thread as resolved:', error);
            throw error;
        }
    },

    /**
     * Reporta contenido (hilo o respuesta).
     */
    async reportContent(
        targetType: 'thread' | 'reply',
        targetId: string,
        threadId: string,
        reporterId: string,
        reporterName: string,
        reason: ReportReason,
        description?: string
    ): Promise<string> {
        try {
            const reportsRef = collection(db, REPORTS_COLLECTION);

            const report: Omit<ForumReport, 'id'> = {
                targetType,
                targetId,
                threadId,
                reporterId,
                reporterName,
                reason,
                description,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(reportsRef, sanitizeData(report));
            return docRef.id;
        } catch (error) {
            console.error('Error reporting content:', error);
            throw error;
        }
    },

    /**
     * Verifica si un usuario ya reportó un contenido específico.
     */
    async hasUserReported(
        targetType: 'thread' | 'reply',
        targetId: string,
        reporterId: string
    ): Promise<boolean> {
        try {
            const reportsRef = collection(db, REPORTS_COLLECTION);
            const q = query(
                reportsRef,
                where('targetType', '==', targetType),
                where('targetId', '==', targetId),
                where('reporterId', '==', reporterId)
            );

            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error) {
            console.error('Error checking if user reported:', error);
            return false;
        }
    },

    /**
     * Obtiene estadísticas globales del foro.
     */
    async getForumStats(): Promise<ForumStats> {
        try {
            const threadsRef = collection(db, THREADS_COLLECTION);

            // Get total threads count
            const threadsSnapshot = await getCountFromServer(threadsRef);
            const totalThreads = threadsSnapshot.data().count;

            // Get total replies (this is an approximation - would need aggregation for exact count)
            // For now, we'll return a placeholder
            const totalReplies = 0; // Would need Cloud Functions for accurate count

            // Active users today (placeholder - needs proper tracking)
            const activeToday = 0;

            // Total users (placeholder)
            const totalUsers = 0;

            return {
                totalThreads,
                totalReplies,
                totalUsers,
                activeToday
            };
        } catch (error) {
            console.error('Error getting forum stats:', error);
            return {
                totalThreads: 0,
                totalReplies: 0,
                totalUsers: 0,
                activeToday: 0
            };
        }
    },

    /**
     * Mueve un hilo a otra categoría.
     */
    async moveThread(threadId: string, newCategory: string): Promise<void> {
        try {
            const threadRef = doc(db, THREADS_COLLECTION, threadId);
            await updateDoc(threadRef, { category: newCategory });
        } catch (error) {
            console.error('Error moving thread:', error);
            throw error;
        }
    }
};
