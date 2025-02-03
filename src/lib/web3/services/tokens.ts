import { ethers } from 'ethers';
import { ERC20_ABI, ERC721_ABI } from '../abis';

export class TokenService {
  private static instance: TokenService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  async initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async getERC20Balance(tokenAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    const balance = await contract.balanceOf(userAddress);
    const decimals = await contract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  }

  async transferERC20(tokenAddress: string, to: string, amount: string): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    const decimals = await contract.decimals();
    const parsedAmount = ethers.parseUnits(amount, decimals);
    
    return await contract.transfer(to, parsedAmount);
  }

  async getNFTBalance(nftAddress: string, userAddress: string): Promise<number> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const contract = new ethers.Contract(nftAddress, ERC721_ABI, this.provider);
    return await contract.balanceOf(userAddress);
  }

  async transferNFT(nftAddress: string, to: string, tokenId: string): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const contract = new ethers.Contract(nftAddress, ERC721_ABI, this.signer);
    return await contract.transferFrom(await this.signer.getAddress(), to, tokenId);
  }
}

export const tokenService = TokenService.getInstance();
