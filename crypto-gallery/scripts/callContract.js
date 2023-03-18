const { ethers, run } = require('hardhat');

async function main() {
	const contractAddr = "0x2e016a9a230e9255faEa52b617feB23bF59203cC";
	const contract = await ethers.getContractAt("CryptoGallery", contractAddr);

	console.log("Owner:", await contract.owner());

	// console.log(`Verifying contract on Etherscan...`);
	// await run("verify:verify", {
	// 	address: contract.address,
	// 	constructorArguments: [],
	// });
}

main();
