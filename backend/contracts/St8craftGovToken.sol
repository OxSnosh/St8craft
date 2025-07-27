//SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title St8craftGovToken This is the token used to purchase nation NFTs
/// @author OxSnosh
/// @notice This token is spent at the amount equivalent cost in USDC to the seed money of the nation
contract St8craftGovToken is ERC20, Ownable {


    /// @param initialSupply is the initial supply minted of St8craftGovToekn
    /// @dev the initialSupply is minted to the deployer of the contract
    constructor(uint256 initialSupply) ERC20("St8craft Governance Token", "ST8") {
        _mint(msg.sender, initialSupply);
    }
}
