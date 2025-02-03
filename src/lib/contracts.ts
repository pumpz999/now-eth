import { Contract } from 'ethers';

const TEMPLATE_MARKETPLACE_ABI = [
  // Events
  "event TemplateCreated(uint256 indexed templateId, string name, uint256 price, uint8 tier)",
  "event TemplatePurchased(uint256 indexed templateId, address indexed buyer, uint256 price)",
  "event FeeRateUpdated(uint256 newFeeRate)",

  // View Functions
  "function templates(uint256) view returns (uint256 id, string name, string metadata, uint256 price, uint8 tier, bool active)",
  "function getUserTemplates(address) view returns (uint256[])",
  "function getTemplate(uint256) view returns (tuple(uint256 id, string name, string metadata, uint256 price, uint8 tier, bool active))",
  
  // State Changing Functions
  "function purchaseTemplate(uint256 templateId) payable",
  "function createTemplate(string name, string metadata, uint256 price, uint8 tier)",
  "function updateFeeRate(uint256 newFeeRate)",
  "function toggleTemplate(uint256 templateId)",
  "function pause()",
  "function unpause()"
];

export class TemplateMarketplace {
  private contract: Contract;

  constructor(address: string, signer: any) {
    this.contract = new Contract(address, TEMPLATE_MARKETPLACE_ABI, signer);
  }

  async purchaseTemplate(templateId: string, value: bigint) {
    const tx = await this.contract.purchaseTemplate(templateId, { value });
    return tx.wait();
  }

  async getTemplate(templateId: string) {
    return this.contract.getTemplate(templateId);
  }

  async getUserTemplates(address: string) {
    return this.contract.getUserTemplates(address);
  }

  async createTemplate(name: string, metadata: string, price: bigint, tier: number) {
    const tx = await this.contract.createTemplate(name, metadata, price, tier);
    return tx.wait();
  }

  async updateFeeRate(newRate: number) {
    const tx = await this.contract.updateFeeRate(newRate);
    return tx.wait();
  }

  async toggleTemplate(templateId: string) {
    const tx = await this.contract.toggleTemplate(templateId);
    return tx.wait();
  }
}
