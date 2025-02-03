import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { web3Service } from '../lib/web3/contracts';
import { transactionService } from '../lib/web3/transactions';

export function useContract(address: string, abi: any[]) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = useCallback(async (
    method: string,
    args: any[] = [],
    options: ethers.TransactionRequest = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const contract = await web3Service.initializeContract(address, abi);
      const tx = await contract[method](...args, options);
      const receipt = await transactionService.waitForTransaction(tx.hash);
      return receipt;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [address, abi]);

  const readContract = useCallback(async (method: string, args: any[] = []) => {
    try {
      const contract = await web3Service.initializeContract(address, abi);
      return await contract[method](...args);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read contract');
      throw err;
    }
  }, [address, abi]);

  return {
    loading,
    error,
    executeTransaction,
    readContract,
  };
}
