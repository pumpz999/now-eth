import { ethers } from 'ethers';

export class StakingService {
  private static instance: StakingService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  private constructor() {}

  static getInstance(): StakingService {
    if (!StakingService.instance) {
      StakingService.instance = new StakingService();
    }
    return StakingService.instance;
  }

  async initialize(provider: ethers.Provider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  async stake(
    stakingContract: string,
    amount: string
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const contract = new ethers.Contract(
      stakingContract,
      [
        'function stake(uint256 amount) public',
        'function approve(address spender, uint256 amount) public returns (bool)'
      ],
      this.signer
    );
    
    // First approve the staking contract
    await contract.approve(stakingContract, amount);
    
    // Then stake
    return await contract.stake(amount);
  }

  async unstake(
    stakingContract: string,
    amount: string
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const contract = new ethers.Contract(
      stakingContract,
      ['function unstake(uint256 amount) public'],
      this.signer
    );
    
    return await contract.unstake(amount);
  }

  async getStakingInfo(stakingContract: string, address: string): Promise<any> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const contract = new ethers.Contract(
      stakingContract,
      [
        'function balanceOf(address account) public view returns (uint256)',
        'function earned(address account) public view returns (uint256)',
        'function rewardRate() public view returns (uint256)',
        'function totalSupply() public view returns (uint256)'
      ],
      this.provider
    );
    
    const [balance, earned, rewardRate, totalSupply] = await Promise.all([
      contract.balanceOf(address),
      contract.earned(address),
      contract.rewardRate(),
      contract.totalSupply()
    ]);
    
    return { balance, earned, rewardRate, totalSupply };
  }
}

export const stakingService = StakingService.getInstance();
