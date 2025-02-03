import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { gasService } from '../lib/web3/gas';

export function useGas() {
  const [estimatedCosts, setEstimatedCosts] = useState<{
    standard: bigint;
    fast: bigint;
    fastest: bigint;
  } | null>(null);

  const estimateTransaction = useCallback(async (transaction: ethers.TransactionRequest) => {
    const costs = await gasService.estimateTransactionCost(transaction);
    setEstimatedCosts(costs);
    return costs;
  }, []);

  const optimizeTransaction = useCallback(async (
    transaction: ethers.TransactionRequest,
    speed: 'standard' | 'fast' | 'fastest' = 'standard'
  ) => {
    return gasService.optimizeGas(transaction, speed);
  }, []);

  return {
    estimatedCosts,
    estimateTransaction,
    optimizeTransaction,
  };
}
