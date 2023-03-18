require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");

const {
	GOERLI_RPC_URL,
	SEPOLIA_RPC_URL,
	MUMBAI_RPC_URL,
	PRIVATE_KEY,
	ETHERSCAN_API_KEY,
	POLYGONSCAN_API_KEY,
} = process.env;

module.exports = {
	solidity: "0.8.19",
	networks: {
		localhost: {
			url: "http://localhost:8545",
			accounts: [
				"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
			],
		},
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
		mumbai: {
			url: MUMBAI_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			//ethereum
			mainnet: ETHERSCAN_API_KEY,
			ropsten: ETHERSCAN_API_KEY,
			goerli: ETHERSCAN_API_KEY,
			sepolia: ETHERSCAN_API_KEY,
			//polygon
			polygon: POLYGONSCAN_API_KEY,
			polygonMumbai: POLYGONSCAN_API_KEY,
		},
	},
};
