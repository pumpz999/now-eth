export interface Template {
  id: string;
  name: string;
  description: string;
  price: number;
  tier: 'Basic' | 'Premium' | 'Enterprise';
  previewUrl: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

export interface NetworkStatus {
  chainId: number;
  name: string;
  isConnected: boolean;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  signer: any | null;
  marketplace?: any; // Add marketplace property
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
