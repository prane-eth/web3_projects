require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require('@nomiclabs/hardhat-etherscan');

const { MUMBAI_RPC_URL, POLYGONSCAN_API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
	solidity: "0.8.17",
	networks: {
		mumbai: {
			url: MUMBAI_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			//polygon
			polygon: POLYGONSCAN_API_KEY,
			polygonMumbai: POLYGONSCAN_API_KEY,
		},
	},
};
