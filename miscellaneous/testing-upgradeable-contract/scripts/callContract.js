const { ethers } = require("hardhat");

async function main() {
	const contractAddr = '0xF18ad1eBDC2d9fa34122Ad96Fb6b17C3aFa13031';
	const contractAddrUpg = '0xA06f0DF1A58797dE6a4d74219029e9Bda5843468';
	const contractAddrUpgNew = '0x980A9A626e06871E22e61ef71311b50B92B17c5B';
	const contractAddrProxy = '0xF9993CC3146Ec18a17760996C3a6e171C45F8C36';

	const contractFactory = await ethers.getContractFactory('VendMachineV1');
	const contract = contractFactory.attach(contractAddr);
	const contractUpg = contractFactory.attach(contractAddrUpg);
	const contractUpgNew = contractFactory.attach(contractAddrUpgNew);
	const contractProxy = contractFactory.attach(contractAddrProxy);

	// const tx = await contractUpgNew.initialize(100);
	// console.log(await tx.wait());

	console.log((await contract.numSodas()).toString());
	console.log((await contractUpg.numSodas()).toString());
	console.log((await contractUpgNew.numSodas()).toString());
	console.log((await contractProxy.numSodas()).toString());

	// purchaseSoda with 1000 wei
	// for (let i = 0; i < 1; i++) {
	// 	const tx = await contractUpgNew.purchaseSoda({ value: 1000, 
	// 		gasPrice: ethers.utils.parseUnits('50', 'gwei'),
	// 		gasLimit: 500000 });
	// 	console.log((await tx.wait()).transactionHash);
	// }

	// console.log((await contract.numSodas()).toString());
	// console.log((await contractUpg.numSodas()).toString());
	// console.log((await contractUpgNew.numSodas()).toString());
	// console.log((await contractProxy.numSodas()).toString());
}

main();