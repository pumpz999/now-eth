import React from 'react';
import { NetworkStatus } from '../types';
import { Globe } from 'lucide-react';

interface NetworkSelectorProps {
  networks: NetworkStatus[];
  currentChainId: number | null;
  onNetworkChange: (chainId: number) => void;
}

export function NetworkSelector({
  networks,
  currentChainId,
  onNetworkChange,
}: NetworkSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <select
        value={currentChainId || ''}
        onChange={(e) => onNetworkChange(Number(e.target.value))}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Select Network</option>
        {networks.map((network) => (
          <option key={network.chainId} value={network.chainId}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
}
