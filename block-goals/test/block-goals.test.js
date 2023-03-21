const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther, formatEther } = ethers.utils;

const deployContract = async (contractName, ...args) => {
	const contract = await ethers
		.getContractFactory(contractName)
		.then(contractFactory => contractFactory.deploy(...args));
	await contract.deployed();
	return contract;
};

const deployProxy = async (contractName, ...args) => {
	const contract = await ethers
		.getContractFactory(contractName)
		.then(contractFactory => upgrades.deployProxy(contractFactory, [...args]));
	await contract.deployed();
	return contract;
};

describe("BlockGoals", function () {
	var contract, owner, user;
	const smallAmountString = "0.1";
	const smallAmount = parseEther(smallAmountString);

	it("Should deploy without errors", async function () {
		[owner, user] = await ethers.getSigners();
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
	});

	var targetIndex = 1;
	it("Should deposit for a task", async function () {
		await contract.deposit(targetIndex, { value: smallAmount });
		var allTasks = await contract.getAllTasks();
		const taskBalance = formatEther(allTasks[targetIndex].balance);
		expect(taskBalance).to.equal(smallAmountString);
	});
	it("Should finish a task and refund ether", async function () {
		const balanceBefore = await owner.getBalance();
		await contract.finishTask(targetIndex);
		const balanceAfter = await owner.getBalance();
		const difference = formatEther(balanceAfter - balanceBefore + '');

		const allTasks = await contract.getAllTasks();
		var task = allTasks[targetIndex];
		expect(task.done).to.equal(true);
		expect(task.balance).to.equal(0);
		expect(Number(difference)).to.be.within(0.09, 0.1);
	});
	it("Should delete a task", async function () {
		await contract.deleteTask(targetIndex);
		expect(await contract.getAllTasks()).to.have.lengthOf(1);
	});
	it("Should be deployed as proxy", async function () {
		const proxy = await deployProxy("BlockGoals");
		expect(await proxy.deployed()).to.equal(proxy);
	});
});
