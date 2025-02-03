import * as Sentry from '@sentry/react';
import { logger } from './logger';

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, context?: Record<string, any>) {
    // Log to Sentry
    Sentry.captureException(error, { extra: context });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
      if (context) {
        console.error('Context:', context);
      }
    }

    // Log to our logging service
    logger.logError(error, context);

    return {
      message: this.getUserFriendlyMessage(error),
      code: this.getErrorCode(error),
    };
  }

  private getUserFriendlyMessage(error: Error): string {
    // Map technical errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      'MetaMask Tx Signature: User denied transaction signature':
        'Please approve the transaction in your wallet to continue.',
      'insufficient funds':
        'You don\'t have enough funds to complete this transaction.',
      'execution reverted':
        'The transaction couldn\'t be completed. Please try again.',
    };

    for (const [technical, friendly] of Object.entries(errorMessages)) {
      if (error.message.includes(technical)) {
        return friendly;
      }
    }

    return 'An unexpected error occurred. Please try again later.';
  }

  private getErrorCode(error: Error): string {
    // Extract error code if available
    const codeMatch = error.message.match(/\[(\w+)\]/);
    return codeMatch ? codeMatch[1] : 'UNKNOWN_ERROR';
  }

  async handleTransaction(
    txPromise: Promise<any>,
    context: {
      type: string;
      description: string;
      [key: string]: any;
    }
  ) {
    try {
      const result = await txPromise;
      logger.logInfo(`Transaction successful: ${context.type}`, {
        ...context,
        hash: result.hash,
      });
      return result;
    } catch (error) {
      this.handleError(error as Error, context);
      throw error;
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();
