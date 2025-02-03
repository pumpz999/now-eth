export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Map<string, number[]> = new Map();
  private timers: Map<string, number> = new Map();

  private constructor() {
    this.initializePerformanceObserver();
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  private initializePerformanceObserver() {
    if (typeof window !== 'undefined') {
      // Observe page load metrics
      const pageObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(`page-${entry.name}`, entry.duration);
        }
      });

      pageObserver.observe({ entryTypes: ['navigation', 'paint'] });

      // Observe long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.recordMetric('long-task', entry.duration);
          }
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Observe layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('layout-shift', entry.value);
        }
      });

      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  startTimer(name: string) {
    this.timers.set(name, performance.now());
  }

  endTimer(name: string) {
    const startTime = this.timers.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
      this.timers.delete(name);
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Send to analytics if threshold is reached
    if (this.metrics.get(name)!.length >= 10) {
      this.sendMetrics(name);
    }
  }

  private sendMetrics(name: string) {
    const values = this.metrics.get(name)!;
    const averageValue = values.reduce((a, b) => a + b, 0) / values.length;

    // Send to your analytics service
    console.log(`Metric ${name}: ${averageValue}`);

    // Clear the metrics
    this.metrics.set(name, []);
  }

  getMetrics() {
    const result: Record<string, { average: number; count: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        result[name] = {
          average: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
        };
      }
    }

    return result;
  }
}

export const metricsCollector = MetricsCollector.getInstance();
