const { ethers, network, upgrades } = require("hardhat");

async function main() {
	const contractFactory = await ethers.getContractFactory("BlockGoals");
	const proxy = await upgrades.deployProxy(contractFactory, []);
	// add args in array [], like [arg1, arg2, ...]
	await proxy.deployed();

	const implementationAddress =
		await upgrades.erc1967.getImplementationAddress(proxy.address);

	console.log("Proxy contract address: " + proxy.address);
	console.log("Implementation contract address: " + implementationAddress);

	console.log(
		"Contract source code could be verified on Etherscan/Polygonscan using the following command:"
	);
	console.log(
		`npx hardhat verify ${proxy.address} --network ${network.name}`
	);
}

main();
