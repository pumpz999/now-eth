export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, { startTime: number; duration?: number }> = new Map();

  private constructor() {
    this.observePageLoad();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private observePageLoad() {
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.logMetric('page-load', entry);
        }
      });

      observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
    }
  }

  startTimer(key: string) {
    this.metrics.set(key, { startTime: performance.now() });
  }

  endTimer(key: string) {
    const metric = this.metrics.get(key);
    if (metric) {
      metric.duration = performance.now() - metric.startTime;
      this.logMetric(key, { duration: metric.duration });
    }
  }

  private logMetric(key: string, data: any) {
    // Send metrics to your analytics service
    console.log(`Performance metric - ${key}:`, data);
  }

  measureMemory() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.logMetric('memory', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
      });
    }
  }

  getLongTasks() {
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.logMetric('long-task', entry);
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
