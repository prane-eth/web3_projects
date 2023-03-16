require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();

const { RPC_URL, PRIVATE_KEY, ETHERSCAN_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY
  }
};