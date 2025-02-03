// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TemplateMarketplace is AccessControl, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;

    bytes32 public constant ADMIN1_ROLE = keccak256("ADMIN1_ROLE");
    bytes32 public constant ADMIN2_ROLE = keccak256("ADMIN2_ROLE");

    struct Template {
        uint256 id;
        string name;
        string metadata;
        uint256 price;
        TemplateTier tier;
        bool active;
    }

    enum TemplateTier { Basic, Premium, Enterprise }

    Counters.Counter private _templateIds;
    mapping(uint256 => Template) public templates;
    mapping(address => uint256[]) public userTemplates;

    uint256 public constant BASIS_POINTS = 10000;
    uint256 public feeRate = 250; // 2.5% fee
    address public admin1;
    address public admin2;

    event TemplateCreated(uint256 indexed templateId, string name, uint256 price, TemplateTier tier);
    event TemplatePurchased(uint256 indexed templateId, address indexed buyer, uint256 price);
    event FeeRateUpdated(uint256 newFeeRate);

    constructor(address _admin1, address _admin2) {
        require(_admin1 != address(0) && _admin2 != address(0), "Invalid admin addresses");
        admin1 = _admin1;
        admin2 = _admin2;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN1_ROLE, _admin1);
        _grantRole(ADMIN2_ROLE, _admin2);
    }

    function createTemplate(
        string memory name,
        string memory metadata,
        uint256 price,
        TemplateTier tier
    ) external onlyRole(ADMIN1_ROLE) {
        _templateIds.increment();
        uint256 templateId = _templateIds.current();

        templates[templateId] = Template({
            id: templateId,
            name: name,
            metadata: metadata,
            price: price,
            tier: tier,
            active: true
        });

        emit TemplateCreated(templateId, name, price, tier);
    }

    function purchaseTemplate(uint256 templateId) external payable nonReentrant whenNotPaused {
        Template storage template = templates[templateId];
        require(template.active, "Template not available");
        require(msg.value >= template.price, "Insufficient payment");

        // Calculate fee distribution
        uint256 fee = (msg.value * feeRate) / BASIS_POINTS;
        uint256 admin1Share = (fee * 70) / 100;
        uint256 admin2Share = fee - admin1Share;

        // Transfer fees
        (bool success1, ) = admin1.call{value: admin1Share}("");
        require(success1, "Admin1 fee transfer failed");
        
        (bool success2, ) = admin2.call{value: admin2Share}("");
        require(success2, "Admin2 fee transfer failed");

        // Add template to user's collection
        userTemplates[msg.sender].push(templateId);

        emit TemplatePurchased(templateId, msg.sender, msg.value);
    }

    function updateFeeRate(uint256 newFeeRate) external onlyRole(ADMIN1_ROLE) {
        require(newFeeRate <= 1000, "Fee rate too high"); // Max 10%
        feeRate = newFeeRate;
        emit FeeRateUpdated(newFeeRate);
    }

    function toggleTemplate(uint256 templateId) external onlyRole(ADMIN1_ROLE) {
        require(templates[templateId].id != 0, "Template does not exist");
        templates[templateId].active = !templates[templateId].active;
    }

    function getUserTemplates(address user) external view returns (uint256[] memory) {
        return userTemplates[user];
    }

    function getTemplate(uint256 templateId) external view returns (Template memory) {
        return templates[templateId];
    }

    function pause() external onlyRole(ADMIN1_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN1_ROLE) {
        _unpause();
    }

    receive() external payable {
        revert("Direct payments not accepted");
    }
}
