import { ethers } from 'ethers';
import { ipfsService } from './ipfs';

export class NFTService {
  private static instance: NFTService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  private constructor() {}

  static getInstance(): NFTService {
    if (!NFTService.instance) {
      NFTService.instance = new NFTService();
    }
    return NFTService.instance;
  }

  async initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async mintNFT(
    contractAddress: string,
    tokenURI: string,
    royaltyFee: number = 250 // 2.5%
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const contract = new ethers.Contract(
      contractAddress,
      ['function mint(string memory tokenURI, uint96 royaltyFee) public returns (uint256)'],
      this.signer
    );
    
    return await contract.mint(tokenURI, royaltyFee);
  }

  async uploadMetadata(
    name: string,
    description: string,
    image: File,
    attributes: Array<{ trait_type: string; value: string }>
  ): Promise<string> {
    const imageCID = await ipfsService.uploadFile(image);
    
    const metadata = {
      name,
      description,
      image: `ipfs://${imageCID}`,
      attributes,
    };
    
    return await ipfsService.uploadJSON(metadata);
  }

  async getNFTMetadata(contractAddress: string, tokenId: string): Promise<any> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const contract = new ethers.Contract(
      contractAddress,
      ['function tokenURI(uint256 tokenId) public view returns (string)'],
      this.provider
    );
    
    const tokenURI = await contract.tokenURI(tokenId);
    const response = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'));
    return await response.json();
  }
}

export const nftService = NFTService.getInstance();
