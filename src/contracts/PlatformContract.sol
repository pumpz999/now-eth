// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract PlatformContract is Ownable, ReentrancyGuard, Pausable {
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public platformFee = 250; // 2.5% default fee
    
    struct Service {
        uint256 id;
        string name;
        uint256 price;
        bool active;
    }
    
    mapping(uint256 => Service) public services;
    mapping(address => uint256[]) public userServices;
    uint256 public serviceCount;
    
    event ServiceCreated(uint256 indexed id, string name, uint256 price);
    event ServicePurchased(uint256 indexed id, address indexed user, uint256 price);
    event FeeUpdated(uint256 newFee);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor() {
        _transferOwnership(msg.sender);
    }
    
    function setFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = newFee;
        emit FeeUpdated(newFee);
    }
    
    function createService(string memory name, uint256 price) external onlyOwner {
        serviceCount++;
        services[serviceCount] = Service(serviceCount, name, price, true);
        emit ServiceCreated(serviceCount, name, price);
    }
    
    function purchaseService(uint256 serviceId) external payable nonReentrant whenNotPaused {
        Service storage service = services[serviceId];
        require(service.active, "Service not available");
        require(msg.value >= service.price, "Insufficient payment");
        
        uint256 fee = (msg.value * platformFee) / BASIS_POINTS;
        userServices[msg.sender].push(serviceId);
        
        emit ServicePurchased(serviceId, msg.sender, msg.value);
    }
    
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    function getUserServices(address user) external view returns (uint256[] memory) {
        return userServices[user];
    }
    
    function toggleService(uint256 serviceId) external onlyOwner {
        require(serviceId <= serviceCount, "Invalid service ID");
        services[serviceId].active = !services[serviceId].active;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    receive() external payable {}
}
