import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { TEMPLATE_MARKETPLACE_ABI } from '../lib/web3/abis';
import { useSelector } from 'react-redux';
import { selectWallet } from '../store/slices/walletSlice';

const MARKETPLACE_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with actual contract address

export function useTemplateMarketplace() {
  const wallet = useSelector(selectWallet);
  const { loading, error, executeTransaction, readContract } = useContract(
    MARKETPLACE_ADDRESS,
    TEMPLATE_MARKETPLACE_ABI
  );

  const purchaseTemplate = useCallback(async (templateId: string, price: string) => {
    if (!wallet.isConnected) {
      throw new Error('Wallet not connected');
    }

    return executeTransaction(
      'purchaseTemplate',
      [templateId],
      { value: ethers.parseEther(price) }
    );
  }, [wallet.isConnected, executeTransaction]);

  const createTemplate = useCallback(async (
    name: string,
    metadata: string,
    price: string,
    tier: number
  ) => {
    if (!wallet.isConnected) {
      throw new Error('Wallet not connected');
    }

    return executeTransaction(
      'createTemplate',
      [name, metadata, ethers.parseEther(price), tier]
    );
  }, [wallet.isConnected, executeTransaction]);

  const getTemplate = useCallback(async (templateId: string) => {
    return readContract('getTemplate', [templateId]);
  }, [readContract]);

  const getUserTemplates = useCallback(async (address: string) => {
    return readContract('getUserTemplates', [address]);
  }, [readContract]);

  const updateFeeRate = useCallback(async (newRate: number) => {
    if (!wallet.isConnected) {
      throw new Error('Wallet not connected');
    }

    return executeTransaction('updateFeeRate', [newRate]);
  }, [wallet.isConnected, executeTransaction]);

  return {
    loading,
    error,
    purchaseTemplate,
    createTemplate,
    getTemplate,
    getUserTemplates,
    updateFeeRate,
  };
}
