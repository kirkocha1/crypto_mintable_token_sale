const path = require("path");
require('dotenv').config({ path: './.env' });
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        development: {
            port: 9545,
            network_id: "*",
            host: "127.0.0.1"
        },
        ganache: {
            provider: function() {
                return new HDWalletProvider(process.env.MNEMONIC, "HTTP://127.0.0.1:7545", MetaMaskAccountIndex);
            },
            port: 7545,
            network_id: "5777",
            host: "127.0.0.1",
            chain_id: "9999"
        }
    },
    compilers: {
        solc: {
            version: "^0.8.0"
        }
    }
};