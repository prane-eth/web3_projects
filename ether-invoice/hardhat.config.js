require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { MUMBAI_RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
	solidity: "0.8.9",
	networks: {
		mumbai: {
			url: MUMBAI_RPC_URL,
			accounts: [`0x${PRIVATE_KEY}`],
		},
	},
};
