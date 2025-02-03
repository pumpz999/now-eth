import { ethers } from 'ethers';
import { logger } from './logger';
import { errorHandler } from './errorHandler';

export class TransactionMonitor {
  private static instance: TransactionMonitor;
  private transactions: Map<string, {
    status: 'pending' | 'success' | 'failed';
    type: string;
    timestamp: number;
    data: any;
  }> = new Map();

  private constructor() {}

  static getInstance(): TransactionMonitor {
    if (!TransactionMonitor.instance) {
      TransactionMonitor.instance = new TransactionMonitor();
    }
    return TransactionMonitor.instance;
  }

  async monitorTransaction(
    tx: ethers.TransactionResponse,
    type: string,
    data?: any
  ) {
    this.transactions.set(tx.hash, {
      status: 'pending',
      type,
      timestamp: Date.now(),
      data,
    });

    try {
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        this.transactions.set(tx.hash, {
          status: 'success',
          type,
          timestamp: Date.now(),
          data,
        });

        logger.logInfo(`Transaction successful: ${type}`, {
          hash: tx.hash,
          data,
        });
      } else {
        throw new Error('Transaction failed');
      }

      return receipt;
    } catch (error) {
      this.transactions.set(tx.hash, {
        status: 'failed',
        type,
        timestamp: Date.now(),
        data,
      });

      errorHandler.handleError(error as Error, {
        type,
        hash: tx.hash,
        data,
      });

      throw error;
    }
  }

  getTransaction(hash: string) {
    return this.transactions.get(hash);
  }

  getPendingTransactions() {
    return Array.from(this.transactions.entries())
      .filter(([_, tx]) => tx.status === 'pending')
      .map(([hash, tx]) => ({ hash, ...tx }));
  }

  getRecentTransactions(limit: number = 10) {
    return Array.from(this.transactions.entries())
      .sort((a, b) => b[1].timestamp - a[1].timestamp)
      .slice(0, limit)
      .map(([hash, tx]) => ({ hash, ...tx }));
  }
}

export const transactionMonitor = TransactionMonitor.getInstance();
