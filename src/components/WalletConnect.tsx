import React from 'react';
import { WalletState } from '../types';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  walletState: WalletState;
  onConnect: () => void;
}

export function WalletConnect({ walletState, onConnect }: WalletConnectProps) {
  return (
    <div className="flex items-center gap-4">
      {walletState.isConnected ? (
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-lg">
          <Wallet className="w-4 h-4" />
          <span className="text-sm font-medium">
            {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
          </span>
          <span className="text-sm text-gray-500">
            ({walletState.balance?.slice(0, 6)} ETH)
          </span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </button>
      )}
    </div>
  );
}