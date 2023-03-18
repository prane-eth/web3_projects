const { ethers, upgrades } = require("hardhat");

async function main() {
	const contractFactory = await ethers.getContractFactory("CryptoGallery");
	const contract = await contractFactory.deploy();
	await contract.deployed();

	console.log("Contract address: " + contract.address);
}

main();
