require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const { RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY]
    },
  }
};
