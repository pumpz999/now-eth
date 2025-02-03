import { useState, useCallback, useEffect } from 'react';
import { WalletState } from '../types';
import { connectWallet, switchNetwork } from '../lib/web3';
import { TemplateMarketplace } from '../lib/contracts';

const MARKETPLACE_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual contract address

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    signer: null,
    marketplace: null,
  });

  const connect = useCallback(async () => {
    try {
      const wallet = await connectWallet();
      const marketplace = new TemplateMarketplace(MARKETPLACE_ADDRESS, wallet.signer);
      
      setWalletState({
        isConnected: true,
        address: wallet.address,
        chainId: wallet.chainId,
        balance: wallet.balance,
        signer: wallet.signer,
        marketplace,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, []);

  const handleNetworkChange = useCallback(async (chainId: number) => {
    try {
      const success = await switchNetwork(chainId);
      if (success) {
        setWalletState(prev => ({ ...prev, chainId }));
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        // Reconnect to get new wallet state
        connect();
      });

      window.ethereum.on('chainChanged', () => {
        // Reconnect to get new wallet state
        connect();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, [connect]);

  return {
    walletState,
    connect,
    handleNetworkChange,
  };
}
