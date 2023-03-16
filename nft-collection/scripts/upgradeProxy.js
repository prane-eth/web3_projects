// const { ethers, upgrades } = require('hardhat');

// const proxyAddress = "";

// async function upgrade() {
// 	const NewNftCollection = await ethers.getContractFactory("NewNftCollection");
// 	const upgraded = await upgrades.upgradeProxy(proxyAddress, NewNftCollection);

// 	const implementationAddress =
// 		await upgrades.erc1967.getImplementationAddress(proxyAddress);

// 	console.log("The current contract owner is: " + (await upgraded.owner()));
// 	console.log("Upgrade: Implementation contract address: " + implementationAddress);
// }
// // async function downgrade() {  // downgrade if any security flaw or bugs in new version
// // 	const NftCollection = await ethers.getContractFactory("NftCollection");
// // 	await upgrades.forceImport(proxyAddress, NftCollection);
// // 	console.log("V1 proxy contract registered for downgrading");
// // }

// upgrade();
