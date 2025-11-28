// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Faucet {
    IERC20 public token;
    address public owner;
    uint256 public claimAmount = 100 * 10 ** 18;
    uint256 public cooldownTime = 24 hours;
    
    mapping(address => uint256) public lastClaimTime;

    event TokensClaimed(address indexed user, uint256 amount);
    event TokensWithdrawn(address indexed owner, uint256 amount);

    /**
     * @param tokenAddress The address of the ERC20 token to distribute
     */
    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
        owner = msg.sender;
    }

    /**
     * Modifier to restrict functions to only the owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "You do not have enough permissions.");
        _;
    }

    /**
     * Allows a user to claim tokens from the faucet
     */
    function claim() external {
        require(
            block.timestamp >= lastClaimTime[msg.sender] + cooldownTime,
            "You may make another claim 24 hours after your previous one."
        );
        
        require(
            token.balanceOf(address(this)) >= claimAmount,
            "The faucet is empty!"
        );

        lastClaimTime[msg.sender] = block.timestamp;

        require(
            token.transfer(msg.sender, claimAmount), 
            "Token transfer has failed."
        );

        emit TokensClaimed(msg.sender, claimAmount);
    }

    /**
     * Checks if a user can claim tokens right now
     * @param addr The address to check
     * @return bool True if the user can claim
     */
    function canClaim(address addr) external view returns (bool) {
        return block.timestamp >= lastClaimTime[addr] + cooldownTime;
    }

    /**
     * Returns the time remaining until a user can claim again
     * @param user The address to check
     * @return uint256 Seconds until user can claim (0 if they can claim now)
     */
    function timeUntilNextClaim(address user) external view returns (uint256) {
        uint256 nextClaimTime = lastClaimTime[user] + cooldownTime;
        
        if (block.timestamp >= nextClaimTime) {
            return 0;
        }
        
        return nextClaimTime - block.timestamp;
    }

    /**
     * Initiates token withdrawal process
     * @param amount The amount to withdraw (in smallest unit, with decimals)
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(token.transfer(owner, amount), "Transfer failed");
        emit TokensWithdrawn(owner, amount);
    }

    /**
     * @return uint256 The amount of tokens the faucet holds
     */
    function getFaucetBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /**
     * @param newAmount The new claim amount (in smallest unit, with decimals)
     */
    function setClaimAmount(uint256 newAmount) external onlyOwner {
        claimAmount = newAmount;
    }

    /**
     * @param newCooldown The new cooldown in seconds
     */
    function setCooldownTime(uint256 newCooldown) external onlyOwner {
        cooldownTime = newCooldown;
    }
}