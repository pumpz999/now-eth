import { ethers } from 'ethers';
import { web3Service } from './contracts';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  gasPrice: bigint;
  gasLimit: bigint;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  type: 'send' | 'contract' | 'template';
  metadata?: any;
}

export class TransactionHistoryService {
  private transactions: Map<string, Transaction> = new Map();

  async addTransaction(tx: ethers.TransactionResponse, type: Transaction['type'], metadata?: any) {
    const transaction: Transaction = {
      hash: tx.hash,
      from: tx.from,
      to: tx.to!,
      value: tx.value,
      gasPrice: tx.gasPrice!,
      gasLimit: tx.gasLimit,
      timestamp: Date.now(),
      status: 'pending',
      type,
      metadata,
    };

    this.transactions.set(tx.hash, transaction);
    this.watchTransaction(tx.hash);
    
    return transaction;
  }

  private async watchTransaction(hash: string) {
    try {
      const receipt = await web3Service.getProvider()!.waitForTransaction(hash);
      const transaction = this.transactions.get(hash);
      
      if (transaction) {
        transaction.status = receipt.status === 1 ? 'confirmed' : 'failed';
        this.transactions.set(hash, transaction);
      }
    } catch (error) {
      const transaction = this.transactions.get(hash);
      if (transaction) {
        transaction.status = 'failed';
        this.transactions.set(hash, transaction);
      }
    }
  }

  getTransaction(hash: string): Transaction | undefined {
    return this.transactions.get(hash);
  }

  getTransactions(): Transaction[] {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getTransactionsByType(type: Transaction['type']): Transaction[] {
    return this.getTransactions().filter(tx => tx.type === type);
  }

  getTransactionsByAddress(address: string): Transaction[] {
    return this.getTransactions().filter(tx => 
      tx.from.toLowerCase() === address.toLowerCase() ||
      tx.to.toLowerCase() === address.toLowerCase()
    );
  }
}

export const transactionHistory = new TransactionHistoryService();
