/**
 * LocalCache - A utility for managing temporary local storage data
 * with automatic expiration and cleanup
 */

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 1 hour)
  namespace?: string; // Namespace prefix for keys (default: 'bizmod-cache')
}

const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour
const DEFAULT_NAMESPACE = 'bizmod-cache';

export class LocalCache {
  private namespace: string;
  private defaultTTL: number;

  constructor(options: CacheOptions = {}) {
    this.namespace = options.namespace || DEFAULT_NAMESPACE;
    this.defaultTTL = options.ttl || DEFAULT_TTL;
  }

  /**
   * Get a prefixed cache key
   */
  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  /**
   * Set a cache item with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt,
    };

    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Failed to set cache item:', error);
      // If storage is full, try to clear expired items
      this.clearExpired();
      // Try again
      try {
        localStorage.setItem(this.getKey(key), JSON.stringify(cacheItem));
      } catch (retryError) {
        console.error('Failed to set cache item after cleanup:', retryError);
      }
    }
  }

  /**
   * Get a cache item if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      // Check if expired
      if (now > cacheItem.expiresAt) {
        this.delete(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Failed to get cache item:', error);
      return null;
    }
  }

  /**
   * Delete a specific cache item
   */
  delete(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Failed to delete cache item:', error);
    }
  }

  /**
   * Check if a cache item exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear all cache items in this namespace
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      const prefix = `${this.namespace}:`;
      
      keys.forEach((key) => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Clear only expired cache items
   */
  clearExpired(): void {
    try {
      const keys = Object.keys(localStorage);
      const prefix = `${this.namespace}:`;
      const now = Date.now();
      
      keys.forEach((key) => {
        if (key.startsWith(prefix)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const cacheItem: CacheItem = JSON.parse(item);
              if (now > cacheItem.expiresAt) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            // Invalid item, remove it
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Failed to clear expired cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalItems: number;
    expiredItems: number;
    totalSize: number;
  } {
    const keys = Object.keys(localStorage);
    const prefix = `${this.namespace}:`;
    const now = Date.now();
    let totalItems = 0;
    let expiredItems = 0;
    let totalSize = 0;

    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        totalItems++;
        try {
          const item = localStorage.getItem(key);
          if (item) {
            totalSize += item.length;
            const cacheItem: CacheItem = JSON.parse(item);
            if (now > cacheItem.expiresAt) {
              expiredItems++;
            }
          }
        } catch (error) {
          // Ignore invalid items
        }
      }
    });

    return {
      totalItems,
      expiredItems,
      totalSize,
    };
  }
}

// Create a singleton instance for the app
export const appCache = new LocalCache({
  namespace: 'bizmod-cache',
  ttl: 60 * 60 * 1000, // 1 hour
});

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  // Clear expired items on load
  appCache.clearExpired();
  
  // Set up periodic cleanup (every 5 minutes)
  setInterval(() => {
    appCache.clearExpired();
  }, 5 * 60 * 1000);
}
