// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; 

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 

contract MyToken is ERC20 {
    /**
     * Mints the initial supply to the deployer
     * @param tokensToMint The amount of tokens to mint (in whole tokens, not wei)
     */
    constructor(uint256 tokensToMint) ERC20("MyToken", "MTK") {
        _mint(msg.sender, tokensToMint * 10 ** decimals());
    }
}
