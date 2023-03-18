// const { ethers, upgrades } = require('hardhat');

// const proxyAddress = "";

// async function upgrade() {
// 	const NewCryptoGallery = await ethers.getContractFactory("NewCryptoGallery");
// 	const upgraded = await upgrades.upgradeProxy(proxyAddress, NewCryptoGallery);

// 	const implementationAddress =
// 		await upgrades.erc1967.getImplementationAddress(proxyAddress);

// 	console.log("The current contract owner is: " + (await upgraded.owner()));
// 	console.log("Upgrade: Implementation contract address: " + implementationAddress);
// }
// // async function downgrade() {  // downgrade if any security flaw or bugs in new version
// // 	const CryptoGallery = await ethers.getContractFactory("CryptoGallery");
// // 	await upgrades.forceImport(proxyAddress, CryptoGallery);
// // 	console.log("V1 proxy contract registered for downgrading");
// // }

// upgrade();
