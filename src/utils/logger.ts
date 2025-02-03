import * as Sentry from '@sentry/react';

export class Logger {
  private static instance: Logger;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  initialize(dsn: string) {
    if (this.isInitialized) return;

    Sentry.init({
      dsn,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });

    this.isInitialized = true;
  }

  logError(error: Error, context?: Record<string, any>) {
    console.error(error);
    Sentry.captureException(error, { extra: context });
  }

  logInfo(message: string, data?: Record<string, any>) {
    console.info(message, data);
    Sentry.captureMessage(message, {
      level: 'info',
      extra: data,
    });
  }

  logWarning(message: string, data?: Record<string, any>) {
    console.warn(message, data);
    Sentry.captureMessage(message, {
      level: 'warning',
      extra: data,
    });
  }

  setUser(id: string, data?: Record<string, any>) {
    Sentry.setUser({ id, ...data });
  }

  clearUser() {
    Sentry.setUser(null);
  }
}

export const logger = Logger.getInstance();
