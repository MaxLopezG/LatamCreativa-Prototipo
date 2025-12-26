/**
 * Servicio de Reportes
 * 
 * Maneja la creación y gestión de reportes de contenido inapropiado.
 * 
 * @module services/modules/reports
 */
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export interface Report {
    id?: string;
    contentType: 'project' | 'article' | 'comment' | 'user';
    contentId: string;
    contentTitle?: string;
    reporterId: string;
    reporterName: string;
    reason: 'spam' | 'inappropriate' | 'harassment' | 'copyright' | 'other';
    description?: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    notes?: string;
}

export const reportsService = {
    /**
     * Crea un nuevo reporte de contenido.
     * 
     * @param report - Datos del reporte
     * @returns ID del reporte creado
     */
    createReport: async (report: Omit<Report, 'id' | 'status' | 'createdAt'>): Promise<string> => {
        try {
            const reportData: Omit<Report, 'id'> = {
                ...report,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'reports'), reportData);
            return docRef.id;
        } catch (error) {
            console.error('Error creating report:', error);
            throw error;
        }
    },

    /**
     * Obtiene todos los reportes pendientes (para admin).
     * 
     * @returns Array de reportes pendientes
     */
    getPendingReports: async (): Promise<Report[]> => {
        try {
            const q = query(
                collection(db, 'reports'),
                where('status', '==', 'pending'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
        } catch (error) {
            console.error('Error fetching pending reports:', error);
            return [];
        }
    },

    /**
     * Obtiene todos los reportes (para admin).
     * 
     * @returns Array de todos los reportes
     */
    getAllReports: async (): Promise<Report[]> => {
        try {
            const q = query(
                collection(db, 'reports'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
        } catch (error) {
            console.error('Error fetching all reports:', error);
            return [];
        }
    },

    /**
     * Actualiza el estado de un reporte.
     * 
     * @param reportId - ID del reporte
     * @param status - Nuevo estado
     * @param reviewerId - ID del admin que revisa
     * @param notes - Notas opcionales
     */
    updateReportStatus: async (
        reportId: string,
        status: Report['status'],
        reviewerId: string,
        notes?: string
    ): Promise<void> => {
        try {
            const reportRef = doc(db, 'reports', reportId);
            await updateDoc(reportRef, {
                status,
                reviewedAt: new Date().toISOString(),
                reviewedBy: reviewerId,
                ...(notes && { notes })
            });
        } catch (error) {
            console.error('Error updating report status:', error);
            throw error;
        }
    },

    /**
     * Verifica si un usuario ya reportó un contenido específico.
     * 
     * @param contentId - ID del contenido
     * @param reporterId - ID del usuario
     * @returns true si ya existe un reporte
     */
    hasUserReported: async (contentId: string, reporterId: string): Promise<boolean> => {
        try {
            const q = query(
                collection(db, 'reports'),
                where('contentId', '==', contentId),
                where('reporterId', '==', reporterId)
            );
            const snapshot = await getDocs(q);
            return !snapshot.empty;
        } catch (error) {
            console.error('Error checking existing report:', error);
            return false;
        }
    }
};
