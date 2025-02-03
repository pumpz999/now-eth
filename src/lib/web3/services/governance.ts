import { ethers } from 'ethers';

export class GovernanceService {
  private static instance: GovernanceService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  private constructor() {}

  static getInstance(): GovernanceService {
    if (!GovernanceService.instance) {
      GovernanceService.instance = new GovernanceService();
    }
    return GovernanceService.instance;
  }

  async initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async createProposal(
    governanceContract: string,
    description: string,
    targets: string[],
    values: number[],
    calldatas: string[]
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const contract = new ethers.Contract(
      governanceContract,
      [
        'function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) public returns (uint256)'
      ],
      this.signer
    );
    
    return await contract.propose(targets, values, calldatas, description);
  }

  async castVote(
    governanceContract: string,
    proposalId: number,
    support: boolean
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const contract = new ethers.Contract(
      governanceContract,
      ['function castVote(uint256 proposalId, bool support) public returns (uint256)'],
      this.signer
    );
    
    return await contract.castVote(proposalId, support);
  }

  async getProposal(governanceContract: string, proposalId: number): Promise<any> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const contract = new ethers.Contract(
      governanceContract,
      ['function proposals(uint256 proposalId) public view returns (tuple(uint256 id, address proposer, uint256 startBlock, uint256 endBlock, string description))'],
      this.provider
    );
    
    return await contract.proposals(proposalId);
  }
}

export const governanceService = GovernanceService.getInstance();
