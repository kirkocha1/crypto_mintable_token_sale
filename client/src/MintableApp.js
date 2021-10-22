import React, { Component } from "react";
import UdemyFinalCourseToken from "./contracts/UdemyFinalCourseToken.json";
import UdemyFinalCourseTokenSale from "./contracts/UdemyFinalCourseTokenSale.json";
import MintableKycContract from "./contracts/MintableKycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class MintableApp extends Component {

  state = { loaded: false, kycAddress: "0x123", tokenSaleAddress: "", tokenAddress: "", userTokens: 0, supply: 0 };

  componentDidMount = async() => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
      console.log(`client accounts: ${this.accounts}`)
      // Get the contract instance.
      //this.networkId = await this.web3.eth.net.getId(); <<- this doesn't work with MetaMask anymore
      //this network_id is hardcoded because chainId and networkId are not the same concept. If you compile contract with network id that differes from chainid
      // you should use metwork id from truffle-config.js for your development 
      this.networkId = await this.web3.eth.net.getId()
      console.log(this.networkId)
      this.udemyFinalCourseToken = new this.web3.eth.Contract(
        UdemyFinalCourseToken.abi,
        UdemyFinalCourseToken.networks[this.networkId] && UdemyFinalCourseToken.networks[this.networkId].address,
      );

      this.udemyFinalCourseSale = new this.web3.eth.Contract(
        UdemyFinalCourseTokenSale.abi,
        UdemyFinalCourseTokenSale.networks[this.networkId] && UdemyFinalCourseTokenSale.networks[this.networkId].address,
      );
      this.mintableKycContract = new this.web3.eth.Contract(
        MintableKycContract.abi,
        MintableKycContract.networks[this.networkId] && MintableKycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      let supply = await this.udemyFinalCourseSale.methods.weiRaised().call()
      this.setState({ loaded:true, tokenSaleAddress: this.udemyFinalCourseSale._address, tokenAddress: this.udemyFinalCourseToken._address, supply: supply }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert( `Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
    }
  }
    
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value });
  }

  handleKycSubmit = async () => {
    const {kycAddress} = this.state;
    console.log(`from account ${this.accounts[0]}`)
    await this.mintableKycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0]});
    alert("Account "+kycAddress+" is now whitelisted");
  }

  handleBuyToken = async () => {
    await this.udemyFinalCourseSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: 1});
  }

  updateUserTokens = async() => {
    let supply = await this.udemyFinalCourseSale.methods.weiRaised().call()
    let userTokens = await this.udemyFinalCourseToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens, supply: supply});
  }

  listenToTokenTransfer = async() => {
    this.udemyFinalCourseToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }
   
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">    
        <h1>Udemy Final Course Mintable Contract</h1>
        <h2>Enable your account</h2>
          Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleKycSubmit}>Add Address to Whitelist</button>
        <h2>Buy UFCM tokens</h2>
        <p>Send Ether to this address: {this.state.tokenSaleAddress}</p>
        <p>UFCM token supply: {this.state.supply}</p>
        <p>Token contract address for import: {this.state.tokenAddress}</p>
        
        <p>Address: {this.accounts[0]} have: {this.state.userTokens}</p>
        <button type="button" onClick={this.handleBuyToken}>Buy more tokens</button>
      </div>
        );
  }

}

export default MintableApp;