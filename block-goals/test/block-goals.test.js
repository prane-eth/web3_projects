const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;
const { getBalance } = ethers.provider;

const deployContract = async (contractName, ...args) => {
	const contract = await ethers
		.getContractFactory(contractName)
		.then((contractFactory) =>
			contractFactory.deploy(...args)
		);
	await contract.deployed();
	return contract;
};

// const deployProxy = async (contractName, ...args) => {
// 	const contract = await ethers
// 		.getContractFactory(contractName)
// 		.then((contractFactory) =>
// 			upgrades.deployProxy(contractFactory, [...args])
// 		);
// 	await contract.deployed();
// 	return contract;
// };

describe("BlockGoals", function () {
	var contract, owner;

	it("Should deploy without errors", async function () {
		[owner] = await ethers.getSigners();
		contract = await deployContract("BlockGoals");
		expect(await contract.deployed()).to.equal(contract);
	});
	it("Should return tasks array with length 0", async function () {
		expect(await contract.getAllTasks()).to.have.lengthOf(0);
	});
	it("Should create a task", async function () {
		await contract.addTask("Test this contract");
		await contract.addTask("Deploy this contract");
		expect(await contract.getAllTasks()).to.have.lengthOf(2);
		console.log(await contract.getAllTasks());
	});

	var targetIndex = 1;
	it("Should deposit for a task", async function () {
		await contract.deposit(targetIndex, { value: parseEther("0.1") });
		var allTasks = await contract.getAllTasks();
		const taskBalance = allTasks[targetIndex].balance;
		expect(parseEther(taskBalance)).to.equal(parseEther("0.1"));
	});
	it("Should finish a task and refund ether", async function () {
		const balanceBefore = await owner.getBalance();
		await contract.finishTask(targetIndex);
		const balanceAfter = await owner.getBalance();

		const allTasks = await contract.getAllTasks();
		var task = allTasks[1];
		expect(task.done).to.equal(true);
		expect(task.balance).to.equal(0);
		expect(balanceAfter - balanceBefore).to.be.within(
			parseEther("0.09"),
			parseEther("0.1")
		);
	});
	it("Should delete a task", async function () {
		await contract.deleteTask(targetIndex);
		expect(await contract.getAllTasks()).to.have.lengthOf(1);
	});
	it("Should refund ether to owner", async function () {
		await contract.addTask("Test this contract");
		await contract.deposit(taskId, { value: parseEther("0.1") });
		const balanceBefore = await owner.getBalance();
		await contract.refundToOwner();
		const balanceAfter = await owner.getBalance();
		expect(balanceAfter - balanceBefore).to.be.within(
			parseEther("0.99"),
			parseEther("1")
		);
	});
});