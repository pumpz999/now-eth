import { ethers } from 'ethers';
import { multichainService } from './multichain';

export class BridgeService {
  private static instance: BridgeService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  private constructor() {}

  static getInstance(): BridgeService {
    if (!BridgeService.instance) {
      BridgeService.instance = new BridgeService();
    }
    return BridgeService.instance;
  }

  async initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async bridgeToken(
    sourceChainId: number,
    targetChainId: number,
    tokenAddress: string,
    amount: string
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    // Get bridge contract for source chain
    const bridgeContract = new ethers.Contract(
      this.getBridgeAddress(sourceChainId),
      [
        'function bridge(address token, uint256 amount, uint256 targetChainId) public payable returns (uint256 bridgeId)',
        'function approve(address spender, uint256 amount) public returns (bool)'
      ],
      this.signer
    );
    
    // First approve the bridge contract
    await bridgeContract.approve(bridgeContract.target, amount);
    
    // Then initiate bridge transaction
    return await bridgeContract.bridge(tokenAddress, amount, targetChainId);
  }

  async claimBridgedTokens(
    targetChainId: number,
    bridgeId: string,
    proof: string[]
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const bridgeContract = new ethers.Contract(
      this.getBridgeAddress(targetChainId),
      ['function claim(uint256 bridgeId, bytes32[] memory proof) public'],
      this.signer
    );
    
    return await bridgeContract.claim(bridgeId, proof);
  }

  private getBridgeAddress(chainId: number): string {
    const bridgeAddresses: { [key: number]: string } = {
      1: '0x...', // Ethereum bridge
      137: '0x...', // Polygon bridge
      // Add more chains as needed
    };
    
    const address = bridgeAddresses[chainId];
    if (!address) throw new Error(`Bridge not supported for chain ${chainId}`);
    
    return address;
  }

  async getBridgeStatus(bridgeId: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const bridgeContract = new ethers.Contract(
      this.getBridgeAddress(await this.provider.getNetwork().then(n => n.chainId)),
      ['function getBridgeStatus(uint256 bridgeId) public view returns (uint8)'],
      this.provider
    );
    
    const status = await bridgeContract.getBridgeStatus(bridgeId);
    return ['Pending', 'Completed', 'Failed'][status];
  }
}

export const bridgeService = BridgeService.getInstance();
