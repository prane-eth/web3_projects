const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;
const { getBalance } = ethers.provider;

const deployContract = async (contractName, ...args) => {
	const contract = await ethers
		.getContractFactory(contractName)
		.then((contractFactory) => contractFactory.deploy(...args));
	await contract.deployed();
	return contract;
};

const appName = "CryptoGallery";

describe(appName, function () {
	let contract, owner, customer, attacker;
	const folderURL =
		"https://ipfs.io/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/";
	const pricePerToken = parseEther("0.01");

	it("Should deploy without errors", async function () {
		[owner, customer, attacker] = await ethers.getSigners();
		contract = await deployContract(appName);
		expect(contract.address).to.properAddress;
	});

	it("Should get values correctly", async function () {
		expect(await contract.PRICE_PER_TOKEN()).to.equal(pricePerToken);
		expect(await contract.LIMIT_PER_ADDRESS()).to.equal(2);
		expect(await contract.MAX_SUPPLY()).to.equal(5);
	});

	it("Should mint NFT", async function () {
		const initialOwnerBalance = await getBalance(owner.address);
		// mint from folder QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL of ipfs
		const tx = await contract
			.connect(customer)
			.mintNFT(folderURL + "1.png", {
				value: pricePerToken,
			});
		const receipt = await tx.wait();
		const finalOwnerBalance = await getBalance(owner.address);
		const event = receipt.events[0];
		expect(event.event).to.equal("Transfer");
		expect(event.args[0]).to.equal(ethers.constants.AddressZero);
		expect(event.args[1]).to.equal(customer.address);
		expect(event.args[2]).to.equal(1);
		expect(await contract.ownerOf(1)).to.equal(customer.address);
		expect(await contract.tokenURI(1)).to.equal(folderURL + "1.png");
		expect(finalOwnerBalance.sub(initialOwnerBalance)).to.equal(
			pricePerToken
		);
	});

	it("Should mint 1 more NFT", async function () {
		const initialOwnerBalance = await getBalance(owner.address);
		const tx = await contract
			.connect(customer)
			.mintNFT(folderURL + "2.png", {
				value: pricePerToken,
			});
		const receipt = await tx.wait();
		const finalOwnerBalance = await getBalance(owner.address);
		const event = receipt.events[0];
		expect(event.event).to.equal("Transfer");
		expect(event.args[0]).to.equal(ethers.constants.AddressZero);
		expect(event.args[1]).to.equal(customer.address);
		expect(event.args[2]).to.equal(2);
		expect(await contract.ownerOf(2)).to.equal(customer.address);
		expect(await contract.tokenURI(2)).to.equal(folderURL + "2.png");
		expect(finalOwnerBalance.sub(initialOwnerBalance)).to.equal(
			pricePerToken
		);
	});

	it("Should not mint 3rd NFT beyond limit per user", async function () {
		await expect(
			contract.connect(customer).mintNFT(folderURL + "3.png", {
				value: pricePerToken,
			})
		).to.be.revertedWith(
			`${appName}: You have exceeded minting limit per address`
		);
	});

	it("Should check if token is available", async function () {
		expect(await contract.isAvailable(folderURL + "1.png")).to.equal(false);
		expect(await contract.isAvailable(folderURL + "2.png")).to.equal(false);
		expect(await contract.isAvailable(folderURL + "3.png")).to.equal(true);
		expect(await contract.isAvailable(folderURL + "4.png")).to.equal(true);
		expect(await contract.isAvailable(folderURL + "5.png")).to.equal(true);
	});
});
