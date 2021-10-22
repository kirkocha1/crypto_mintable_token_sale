var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSales = artifacts.require("./MyTokenSale.sol");
var KycContract = artifacts.require("./KycContract.sol");
var MintableKycContract = artifacts.require("./MintableKycContract.sol");
var UdemyFinalCourseToken = artifacts.require("./UdemyFinalCourseToken.sol");
var UdemyFinalCourseTokenSale = artifacts.require("./UdemyFinalCourseTokenSale.sol");

require('dotenv').config({ path: '../.env' });

async function notMintableMigration(deployer, addr) {
    await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
    await deployer.deploy(KycContract);
    await deployer.deploy(MyTokenSales, 1, addr[0], MyToken.address, KycContract.address);
    let tokenInstance = await MyToken.deployed();
    await tokenInstance.transfer(MyTokenSales.address, process.env.INITIAL_TOKENS);
}

async function mintableMigration(deployer, addr) {
    await deployer.deploy(UdemyFinalCourseToken);
    await deployer.deploy(MintableKycContract);
    await deployer.deploy(UdemyFinalCourseTokenSale, 1, addr[0], UdemyFinalCourseToken.address, MintableKycContract.address);
    let tokenInstance = await UdemyFinalCourseToken.deployed();
    await tokenInstance.addMinter(UdemyFinalCourseTokenSale.address)
}

module.exports = async function(deployer) {
    let addr = await web3.eth.getAccounts();
    await notMintableMigration(deployer, addr)
    await mintableMigration(deployer, addr)
};