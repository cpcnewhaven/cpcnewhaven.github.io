/**
 * Cache Clearing Script
 * Automatically clears all caches when visitors load the site
 * This ensures users always get the latest version of the site
 */

(function() {
    'use strict';

    // Function to clear all caches
    async function clearAllCaches() {
        try {
            // Clear Cache API caches
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => {
                        console.log('Clearing cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
                console.log('All caches cleared');
            }
        } catch (error) {
            console.error('Error clearing caches:', error);
        }
    }

    // Function to unregister all service workers
    async function unregisterServiceWorkers() {
        try {
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(
                    registrations.map(registration => {
                        console.log('Unregistering service worker:', registration.scope);
                        return registration.unregister();
                    })
                );
                console.log('All service workers unregistered');
            }
        } catch (error) {
            console.error('Error unregistering service workers:', error);
        }
    }

    // Function to clear browser storage (localStorage, sessionStorage)
    function clearBrowserStorage() {
        try {
            // Clear localStorage (optional - be careful with this)
            // localStorage.clear();
            
            // Clear sessionStorage
            sessionStorage.clear();
            console.log('Browser storage cleared');
        } catch (error) {
            console.error('Error clearing browser storage:', error);
        }
    }

    // Main function to clear everything
    async function clearCacheOnLoad() {
        console.log('Cache clearing script started...');
        
        // Clear all caches
        await clearAllCaches();
        
        // Unregister service workers
        await unregisterServiceWorkers();
        
        // Clear browser storage (optional)
        clearBrowserStorage();
        
        console.log('Cache clearing complete');
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', clearCacheOnLoad);
    } else {
        // DOM already loaded
        clearCacheOnLoad();
    }

    // Also clear cache when page becomes visible (handles tab switching)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            clearCacheOnLoad();
        }
    });
})();
