require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config({ path: "../common-hardhat-config/.env" });
require("hardhat-gas-reporter");

const {
	GOERLI_RPC_URL,
	SEPOLIA_RPC_URL,
	MUMBAI_RPC_URL,
	PRIVATE_KEY,
	ETHERSCAN_API_KEY,
	POLYGONSCAN_API_KEY,
} = process.env;

module.exports = {
	solidity: {
	  version: "0.8.19",
	  settings: {
		optimizer: {
		  enabled: true,
		  runs: 300,
		},
	  },
	},
	networks: {
		mumbai: {
			url: MUMBAI_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
		localhost: {
			url: "http://localhost:8545",
			accounts: [
				// first private key when we run
				"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
			],
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
	gasReporter: {
		outputFile: "gas-report-new.txt",
		noColors: true,
		currency: "USD",
		token: "ETH",
	},
};

