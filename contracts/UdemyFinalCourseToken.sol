pragma solidity ^0.8.0;

import "./ERC20Mintable.sol";

/**
 * @dev Extension of {ERC20} that adds a set of accounts with the {MinterRole},
 * which have permission to mint (create) new tokens as they see fit.
 *
 * At construction, the deployer of the contract is the only minter.
 */
contract UdemyFinalCourseToken is ERC20Mintable {

    constructor() ERC20("Udemy Final Course Mint Token", "UFCMT") {
    
    }

}