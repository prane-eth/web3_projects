const { ethers, network } = require("hardhat");

async function main() {
	const contractFactory = await ethers.getContractFactory("CryptoGallery");
	const contract = await contractFactory.deploy();
	await contract.deployed();
	console.log('Contract address: ' + contract.address);

	// console.log('Verifying contract on Etherscan/Polygonscan...');
	// await run("verify:verify", {
	// 	address: contract.address,
	// 	constructorArguments: [],
	// });

	console.log('Contract source code could be verified on Etherscan/Polygonscan using the following command:');
	console.log(`npx hardhat verify --network ${network.name} ${contract.address}`);
}

main();
