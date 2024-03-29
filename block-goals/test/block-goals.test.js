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

const appName = "BlockGoals";

describe(appName, function () {
	var contract, owner, allTasks;
	const smallAmount = parseEther("0.1");

	it("Should deploy without errors", async function () {
		[owner] = await ethers.getSigners();
		contract = await deployContract(appName);
		expect(await contract.deployed()).to.equal(contract);
	});
	it("Should return tasks array with length 0", async function () {
		expect(await contract.getAllTasks()).to.have.lengthOf(0);
	});
	it("Should create a task", async function () {
		await contract.addTask("Test this contract");
		await contract.addTask("Deploy this contract");
		await contract.addTask("This is a very long string to test the contract with many characters as long as possible");
	});
	it("Should return tasks", async function () {
		const tasks = await contract.getAllTasks();
		expect(tasks).to.have.lengthOf.above(0);
	});

	var index = 1;
	it("Should deposit for a task", async function () {
		await contract.deposit(index, { value: smallAmount });
		allTasks = await contract.getAllTasks();
		expect(allTasks[index].balance).to.equal(smallAmount);
	});
	it("Should finish a task and refund ether", async function () {
		const balanceBefore = await owner.getBalance();
		await contract.finishTask(index);
		const balanceAfter = await owner.getBalance();
		const difference = formatEther(balanceAfter - balanceBefore + "");

		allTasks = await contract.getAllTasks();
		var task = allTasks[index];
		expect(task.done).to.equal(true);
		expect(task.balance).to.equal(0);
		expect(Number(difference)).to.be.within(0.09, 0.1);
	});
	it("Should delete a task", async function () {
		allTasks = await contract.getAllTasks();
		await contract.deleteTask(index);
		expect(await contract.getAllTasks()).to.have.lengthOf(allTasks.length - 1);
	});
	it("Should be deployed as proxy", async function () {
		const proxy = await deployProxy(appName);
		expect(await proxy.deployed()).to.equal(proxy);
	});
});
