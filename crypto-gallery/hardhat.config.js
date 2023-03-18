require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-upgrades');

const { GOERLI_RPC_URL, SEPOLIA_RPC_URL, MUMBAI_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
	solidity: '0.8.19',
	networks: {
		localhost: {
			url: 'http://localhost:8545',
			accounts: [PRIVATE_KEY]
		},
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: [PRIVATE_KEY]
		},
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY]
		},
		mumbai: {
			url: MUMBAI_RPC_URL,
			accounts: [PRIVATE_KEY]
		},
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	}
};
