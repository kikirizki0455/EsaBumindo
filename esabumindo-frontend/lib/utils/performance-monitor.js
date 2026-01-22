// lib/utils/performance-monitor.js
/**
 * Performance Monitoring Utility
 * Untuk track render time dan performa halaman artikel
 */

export const performanceMetrics = {
  marks: {},
  measures: {},

  // Start measuring
  start(name) {
    this.marks[name] = performance.now();
  },

  // End measuring dan return hasil
  end(name) {
    if (!this.marks[name]) {
      console.warn(`Performance mark "${name}" not found`);
      return 0;
    }

    const duration = performance.now() - this.marks[name];
    this.measures[name] = duration;

    // Log jika melebihi threshold
    if (duration > 5) {
      console.warn(
        `Performance warning: "${name}" took ${duration.toFixed(
          2
        )}ms (threshold: 5ms)`
      );
    }

    return duration;
  },

  // Get all metrics
  getAll() {
    return this.measures;
  },

  // Clear semua metrics
  clear() {
    this.marks = {};
    this.measures = {};
  },

  // Report metrics
  report() {
    console.table(this.measures);
  },
};

// Hook untuk React component
export function usePerformanceMonitor(componentName) {
  if (typeof window === "undefined") return { start: () => {}, end: () => {} };

  return {
    start: () => performanceMetrics.start(componentName),
    end: () => performanceMetrics.end(componentName),
  };
}

// Web Vitals tracking
export async function reportWebVitals(metric) {
  if (typeof window === "undefined") return;

  const endpoint = "/api/metrics";
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
    delta: metric.delta,
  });

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, body);
  } else {
    fetch(endpoint, { body, method: "POST", keepalive: true }).catch(() => {});
  }
}
