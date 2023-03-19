const { ethers, network } = require("hardhat");
const main = async () => {
	const contract = await ethers
		.getContractFactory("BlockGoals")
		.then((contractFactory) => contractFactory.deploy());
	await contract.deployed();
	console.log(
		"Contract deployed address: ",
		contract.address,
		"in network:",
		hre.network.name
	);

	console.log(
		"Contract source code could be verified on Etherscan/Polygonscan using the following command:"
	);
	console.log();
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

runMain();
