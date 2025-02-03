import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, Clock } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.hash}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">
                  {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                </div>
                <div className="text-xs text-gray-500">
                  From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {new Date(tx.timestamp * 1000).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
