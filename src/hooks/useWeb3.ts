import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { web3Service } from '../lib/web3/contracts';
import { setWalletInfo, disconnect } from '../store/slices/walletSlice';

export function useWeb3() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const walletInfo = await web3Service.connectWallet();
      dispatch(setWalletInfo(walletInfo));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      dispatch(disconnect());
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleAccountsChanged = useCallback(async () => {
    try {
      const walletInfo = await web3Service.connectWallet();
      dispatch(setWalletInfo(walletInfo));
    } catch (err) {
      dispatch(disconnect());
    }
  }, [dispatch]);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  return {
    connectWallet,
    loading,
    error,
  };
}
