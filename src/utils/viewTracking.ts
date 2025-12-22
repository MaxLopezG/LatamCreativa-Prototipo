/**
 * View Tracking Utility
 * 
 * Prevents view count inflation by tracking viewed items in localStorage.
 * Views are only counted once per 24-hour period per item.
 */

const VIEW_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface ViewRecord {
    timestamp: number;
}

/**
 * Check if an item should count as a new view
 * @param type - Type of item ('project' | 'profile' | 'article')
 * @param id - Unique identifier of the item
 * @returns true if this is a new view that should be counted
 */
export const shouldCountView = (type: 'project' | 'profile' | 'article', id: string): boolean => {
    if (!id) return false;

    const key = `view_${type}_${id}`;
    const now = Date.now();

    try {
        const stored = localStorage.getItem(key);

        if (stored) {
            const record: ViewRecord = JSON.parse(stored);
            const timeSinceLastView = now - record.timestamp;

            // If viewed within the expiry period, don't count again
            if (timeSinceLastView < VIEW_EXPIRY_MS) {
                return false;
            }
        }

        // Record this view
        const newRecord: ViewRecord = { timestamp: now };
        localStorage.setItem(key, JSON.stringify(newRecord));
        return true;

    } catch (error) {
        // If localStorage fails, still count the view (fail open)
        console.warn('View tracking localStorage error:', error);
        return true;
    }
};

/**
 * Clean up old view records from localStorage
 * Call this periodically to prevent localStorage bloat
 */
export const cleanupOldViewRecords = (): void => {
    try {
        const now = Date.now();
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('view_')) {
                const stored = localStorage.getItem(key);
                if (stored) {
                    try {
                        const record: ViewRecord = JSON.parse(stored);
                        if (now - record.timestamp > VIEW_EXPIRY_MS * 7) { // Clean up after 7 days
                            keysToRemove.push(key);
                        }
                    } catch {
                        keysToRemove.push(key); // Remove corrupted records
                    }
                }
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        console.warn('View tracking cleanup error:', error);
    }
};
