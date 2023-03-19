const { ethers } = require(hardhat);

async function main() {
	const contractAddr = "";
	const contract = await ethers.getContractAt("BlockGoals", contractAddr);

	console.log("Owner:", await contract.owner());
}

main();
