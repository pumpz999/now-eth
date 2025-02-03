export const TEMPLATE_MARKETPLACE_ABI = [
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

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint amount) returns (bool)",
  "function transferFrom(address from, address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint amount)"
];
