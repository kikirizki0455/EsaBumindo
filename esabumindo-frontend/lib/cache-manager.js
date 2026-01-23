/**
 * Cache Manager untuk optimasi performa rendering <5ms
 * Menggunakan in-memory cache dengan TTL dan localStorage fallback
 */

class CacheManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.timers = new Map();
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 menit default
    this.maxSize = options.maxSize || 100; // Max items in cache
  }

  /**
   * Set cache dengan TTL
   */
  set(key, value, ttl = this.defaultTTL) {
    // Jika cache sudah penuh, hapus item tertua
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.delete(firstKey);
    }

    // Hapus timer lama jika ada
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set cache
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });

    // Set auto-expire timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);

    // Simpan ke localStorage jika di browser
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          `cache_${key}`,
          JSON.stringify({
            value,
            timestamp: Date.now(),
            ttl,
          })
        );
      } catch (e) {
        console.warn("localStorage cache failed:", e);
      }
    }
  }

  /**
   * Get cache
   */
  get(key) {
    const cached = this.cache.get(key);

    if (cached) {
      // Check jika sudah expired
      const age = Date.now() - cached.timestamp;
      if (age > cached.ttl) {
        this.delete(key);
        return null;
      }
      return cached.value;
    }

    // Fallback ke localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          const age = Date.now() - parsed.timestamp;
          if (age < parsed.ttl) {
            // Restore ke memory cache
            this.cache.set(key, parsed);
            return parsed.value;
          } else {
            localStorage.removeItem(`cache_${key}`);
          }
        }
      } catch (e) {
        console.warn("localStorage read failed:", e);
      }
    }

    return null;
  }

  /**
   * Delete cache
   */
  delete(key) {
    this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (e) {
        console.warn("localStorage delete failed:", e);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.forEach((_, key) => {
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
      }
    });

    this.cache.clear();
    this.timers.clear();

    if (typeof window !== "undefined") {
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("cache_")) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn("localStorage clear failed:", e);
      }
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      items: Array.from(this.cache.entries()).map(([key, data]) => ({
        key,
        age: Date.now() - data.timestamp,
        ttl: data.ttl,
      })),
    };
  }
}

// Global cache instance
export const globalCache = new CacheManager({
  defaultTTL: 5 * 60 * 1000, // 5 menit
  maxSize: 100,
});

/**
 * Hook untuk caching di React components
 */
export function useCache(key, fetcher, ttl = 5 * 60 * 1000) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      // Check cache dulu
      const cached = globalCache.get(key);
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await fetcher();
        globalCache.set(key, result, ttl);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetcher, ttl]);

  return { data, loading, error };
}

export default CacheManager;
