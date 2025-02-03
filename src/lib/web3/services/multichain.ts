import { ethers } from 'ethers';

interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string;
}

export class MultichainService {
  private static instance: MultichainService;
  private providers: Map<number, ethers.Provider> = new Map();
  private chainConfigs: Map<number, ChainConfig> = new Map();

  private constructor() {
    // Initialize supported chains
    this.initializeChainConfigs();
  }

  static getInstance(): MultichainService {
    if (!MultichainService.instance) {
      MultichainService.instance = new MultichainService();
    }
    return MultichainService.instance;
  }

  private initializeChainConfigs() {
    // Ethereum Mainnet
    this.chainConfigs.set(1, {
      chainId: 1,
      name: 'Ethereum',
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      blockExplorer: 'https://etherscan.io'
    });

    // Polygon
    this.chainConfigs.set(137, {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      blockExplorer: 'https://polygonscan.com'
    });
  }

  async getProvider(chainId: number): Promise<ethers.Provider> {
    if (!this.providers.has(chainId)) {
      const config = this.chainConfigs.get(chainId);
      if (!config) throw new Error(`Chain ${chainId} not supported`);
      
      this.providers.set(
        chainId,
        new ethers.JsonRpcProvider(config.rpcUrl)
      );
    }
    return this.providers.get(chainId)!;
  }

  async switchChain(chainId: number): Promise<boolean> {
    const config = this.chainConfigs.get(chainId);
    if (!config) throw new Error(`Chain ${chainId} not supported`);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: config.name,
            nativeCurrency: config.nativeCurrency,
            rpcUrls: [config.rpcUrl],
            blockExplorerUrls: [config.blockExplorer]
          }],
        });
        return true;
      }
      throw error;
    }
  }

  getChainConfig(chainId: number): ChainConfig | undefined {
    return this.chainConfigs.get(chainId);
  }

  getSupportedChains(): ChainConfig[] {
    return Array.from(this.chainConfigs.values());
  }
}

export const multichainService = MultichainService.getInstance();
