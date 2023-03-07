require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
	solidity: "0.8.4",
	networks: {
		goerli: {
			url: RPC_URL,
			accounts: [PRIVATE_KEY],
		},
	},
};
