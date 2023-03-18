const { ethers, upgrades, run } = require("hardhat");

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
}

main();
