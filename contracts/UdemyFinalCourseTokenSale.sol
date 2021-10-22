// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MintedCrowdsale.sol";
import "./KycContract.sol";
import "./ERC20Mintable.sol";

contract UdemyFinalCourseTokenSale is MintedCrowdsale {

    KycContract kyc;
    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        ERC20Mintable token,
        KycContract _kyc
    )
        Crowdsale(rate, wallet, token)
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(beneficiary), "KYC not completed yet, aborting");
    }

}