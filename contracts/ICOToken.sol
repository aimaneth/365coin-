// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ICOToken is ERC20, Ownable {
    uint256 public tokenPrice = 0.001 ether; // Price in BNB
    uint256 public usdtPrice = 100 * 10**6; // Price in USDT (100 USDT)
    uint256 public maxSupply = 1000000 * 10**18; // 1 million tokens
    uint256 public totalRaised = 0;
    
    address public usdtAddress;
    
    mapping(address => Contribution[]) public contributions;
    
    struct Contribution {
        uint256 amount;
        uint256 tokens;
        uint256 timestamp;
        string currency; // "BNB" or "USDT"
    }
    
    constructor(address _usdtAddress) ERC20("ICO Token", "ICO") {
        usdtAddress = _usdtAddress;
    }
    
    function contributeWithBNB() external payable {
        require(msg.value > 0, "Must send BNB");
        uint256 tokenAmount = (msg.value * 10**18) / tokenPrice;
        require(totalSupply() + tokenAmount <= maxSupply, "Exceeds max supply");
        
        _mint(msg.sender, tokenAmount);
        totalRaised += msg.value;
        
        contributions[msg.sender].push(Contribution({
            amount: msg.value,
            tokens: tokenAmount,
            timestamp: block.timestamp,
            currency: "BNB"
        }));
    }
    
    function contributeWithUSDT(uint256 amount) external {
        IERC20 usdt = IERC20(usdtAddress);
        require(usdt.transferFrom(msg.sender, address(this), amount), "USDT transfer failed");
        
        uint256 tokenAmount = (amount * 10**18) / usdtPrice;
        require(totalSupply() + tokenAmount <= maxSupply, "Exceeds max supply");
        
        _mint(msg.sender, tokenAmount);
        
        contributions[msg.sender].push(Contribution({
            amount: amount,
            tokens: tokenAmount,
            timestamp: block.timestamp,
            currency: "USDT"
        }));
    }
    
    function getContributions(address user) external view returns (Contribution[] memory) {
        return contributions[user];
    }

    // Add a function to withdraw funds
    function withdrawFunds() external onlyOwner {
        // Withdraw BNB
        payable(owner()).transfer(address(this).balance);

        // Withdraw USDT
        IERC20 usdt = IERC20(usdtAddress);
        uint256 usdtBalance = usdt.balanceOf(address(this));
        require(usdt.transfer(owner(), usdtBalance), "USDT transfer failed");
    }
} 