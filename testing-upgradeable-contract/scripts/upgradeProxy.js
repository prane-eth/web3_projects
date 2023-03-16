const { ethers, upgrades } = require("hardhat");

const proxyAddress = "0xF9993CC3146Ec18a17760996C3a6e171C45F8C36";

async function upgrade() {
	const VendMachineV2 = await ethers.getContractFactory("VendMachineV2");
	const upgraded = await upgrades.upgradeProxy(proxyAddress, VendMachineV2);

	const implementationAddress =
		await upgrades.erc1967.getImplementationAddress(proxyAddress);

	console.log("The current contract owner is: " + (await upgraded.owner()));
	console.log("Upgrade: Implementation contract address: " + implementationAddress);
}

async function downgrade() {
	const VendMachineV1 = await ethers.getContractFactory("VendMachineV1");
	await upgrades.forceImport(proxyAddress, VendMachineV1);
	console.log("V1 proxy contract registered for upgrading");
}

upgrade();
