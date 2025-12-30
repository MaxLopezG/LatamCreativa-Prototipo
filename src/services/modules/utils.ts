import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// Helper for pagination
export interface PaginatedResult<T> {
    data: T[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
}

// Helper for timeouts
export const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms))
    ]);
};

// Sanitize data to remove undefined values (JSON pure check)
export const sanitizeData = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data));
};
