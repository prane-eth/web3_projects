const { ethers, upgrades } = require("hardhat");

const proxyAddress = "";

async function upgrade() {
	const NewBlockGoals = await ethers.getContractFactory("NewBlockGoals");
	const upgraded = await upgrades.upgradeProxy(proxyAddress, NewBlockGoals);

	const implementationAddress =
		await upgrades.erc1967.getImplementationAddress(proxyAddress);

	console.log("The current contract owner is: " + (await upgraded.owner()));
	console.log(
		"Upgrade: Implementation contract address: " + implementationAddress
	);
}
// async function downgrade() {  // downgrade if any security flaw or bugs in new version
// 	const BlockGoals = await ethers.getContractFactory("BlockGoals");
// 	await upgrades.forceImport(proxyAddress, BlockGoals);
// 	console.log("V1 proxy contract registered for downgrading");
// }

upgrade();
