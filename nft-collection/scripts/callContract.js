const { ethers } = require(hardhat);

async function main() {
	const contractAddr = '';
	const contract = await ethers.getContractAt('NftCollection', contractAddr);

	console.log("Owner:", await contract.owner());

	const value1 = await ethers.provider.getStorageAt(contractAddr, ethers.utils.hexValue(1));
	console.log(value1);
}

main();
