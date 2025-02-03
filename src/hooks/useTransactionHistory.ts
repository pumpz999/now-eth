import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { transactionHistory, Transaction } from '../lib/web3/history';

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    transactionHistory.getTransactions()
  );

  const addTransaction = useCallback(async (
    tx: ethers.TransactionResponse,
    type: Transaction['type'],
    metadata?: any
  ) => {
    const transaction = await transactionHistory.addTransaction(tx, type, metadata);
    setTransactions(transactionHistory.getTransactions());
    return transaction;
  }, []);

  const getTransactionsByType = useCallback((type: Transaction['type']) => {
    return transactionHistory.getTransactionsByType(type);
  }, []);

  const getTransactionsByAddress = useCallback((address: string) => {
    return transactionHistory.getTransactionsByAddress(address);
  }, []);

  return {
    transactions,
    addTransaction,
    getTransactionsByType,
    getTransactionsByAddress,
  };
}
