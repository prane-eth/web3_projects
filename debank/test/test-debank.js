// unit testing smart contract using Chai
const { expect } = require("chai");

describe("Debank", function () {
	var contract, owner, addr1;
	it("Should deploy without errors", async function () {
		[owner, addr1] = await ethers.getSigners();

		const Bank = await ethers.getContractFactory("Debank");
		contract = await Bank.deploy();
		await contract.deployed();
	});
	it("Should create an account", async function () {
		await contract.createAccount();
		expect(await contract.userHasAccount()).to.equal(true);
	});
	it("Should deposit Ether", async function () {
		await contract.deposit({ value: ethers.utils.parseEther("1") });
		expect(await contract.getBalance()).to.equal(
			ethers.utils.parseEther("1")
		);
	});
	it("Should withdraw Ether", async function () {
		await contract.withdraw(ethers.utils.parseEther("0.7"));
		expect(await contract.getBalance()).to.equal(
			ethers.utils.parseEther("0.3")
		);
	});
	it("Should transfer Ether to another account", async function () {
		await contract.connect(addr1).createAccount();
		await contract.transferToAccount(
			addr1.address,
			ethers.utils.parseEther("0.3")
		);
		expect(await contract.connect(addr1).getBalance()).to.equal(
			ethers.utils.parseEther("0.3")
		);
	});
	it("Should transfer Ether to another wallet", async function () {
		await contract.deposit({ value: ethers.utils.parseEther("0.2") });
		const balanceBefore = hre.ethers.utils.formatEther(
			await addr1.getBalance()
		);
		await contract.transferToWallet(addr1.address, 
			ethers.utils.parseEther("0.2"),
		);
		const balanceAfter = hre.ethers.utils.formatEther(
			await addr1.getBalance()
		);
		expect(balanceAfter - balanceBefore).to.be.greaterThan(0.199).and.lessThan(0.201);
	});
	it("Should pay Ether to another account", async function () {
		await contract.payToAccount(addr1.address, {
			value: ethers.utils.parseEther("0.3"),
		});
		expect(await contract.connect(addr1).getBalance()).to.equal(
			ethers.utils.parseEther("0.6")
		);
	});
	it("Should pay Ether to another wallet", async function () {
		const balanceBefore = hre.ethers.utils.formatEther(
			await addr1.getBalance()
		);
		await contract.payToWallet(addr1.address, {
			value: ethers.utils.parseEther("0.3"),
		});
		const balanceAfter = hre.ethers.utils.formatEther(
			await addr1.getBalance()
		);
		expect(balanceAfter - balanceBefore)
			.to.be.greaterThan(0.29)
			.and.lessThan(0.3);
	});
	it("Should close account", async function () {
		await contract.closeAccount();
		expect(await contract.userHasAccount()).to.equal(false);
	});
	it("Should ensure no Ether is lost when closing account", async function () {
		let ownerWalletBalance = await owner.getBalance();
		ownerWalletBalance = Number(
			hre.ethers.utils.formatEther(ownerWalletBalance)
		);
		let addr1WalletBalance = await addr1.getBalance();
		addr1WalletBalance = Number(
			hre.ethers.utils.formatEther(addr1WalletBalance)
		);
		let addr1AccountBalance = await contract.connect(addr1).getBalance();
		addr1AccountBalance = Number(
			hre.ethers.utils.formatEther(addr1AccountBalance)
		);
		const totalWalletBalance =
			ownerWalletBalance + addr1WalletBalance + addr1AccountBalance;
		expect(totalWalletBalance)
			.to.be.greaterThan(19999.99)
			.and.lessThan(20000);
	});
	it("Should not withdraw when account is closed", async function () {
		const errorMessage =
			"VM Exception while processing transaction: reverted with reason string 'Account does not exist'";
		await expect(
			contract.withdraw(ethers.utils.parseEther("0.1"))
		).to.be.revertedWith(errorMessage);
	});
});