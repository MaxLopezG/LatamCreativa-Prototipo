import React, { ComponentType, LazyExoticComponent } from 'react';

/**
 * A wrapper for React.lazy that reloads the page once if the import fails.
 * This is useful for handling "ChunkLoadError" or "Failed to fetch dynamically imported module" errors
 * that occur when a new version of the app is deployed and the old chunks are no longer available.
 */
export const lazyImport = <T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
): LazyExoticComponent<T> => {
    return React.lazy(async () => {
        try {
            return await factory();
        } catch (error: any) {
            const pageHasAlreadyBeenForceRefreshed = JSON.parse(
                window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
            );

            if (!pageHasAlreadyBeenForceRefreshed) {
                // Mark that we are forcing a refresh so we don't do it infinitely
                window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
                window.location.reload();

                // Return a promise that never resolves (since we are reloading) to prevent React from throwing the error immediately
                return new Promise(() => { });
            }

            // If we already refreshed and it still fails, throw the error
            throw error;
        }
    });
};
