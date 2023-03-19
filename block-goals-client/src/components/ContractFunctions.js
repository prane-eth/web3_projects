import { ethers } from "ethers";
import { getEtherscanLink, getContract } from "./Utils";

const { parseEther } = ethers;

var allTasks, newTask, loadingMessage, isOwner, miningTxn, txnLink;
var setAllTasks, setNewTask, setLoadingMessage, setIsOwner, setMiningTxn, setTxnLink;

export const setHooks = (hooks) => {
	allTasks = hooks.allTasks;
	newTask = hooks.newTask;
	loadingMessage = hooks.loadingMessage;
	isOwner = hooks.isOwner;
	miningTxn = hooks.miningTxn;
	txnLink = hooks.txnLink;

	setAllTasks = hooks.setAllTasks;
	setNewTask = hooks.setNewTask;
	setLoadingMessage = hooks.setLoadingMessage;
	setIsOwner = hooks.setIsOwner;
	setMiningTxn = hooks.setMiningTxn;
	setTxnLink = hooks.setTxnLink;
};

export const setNewTxnLink = async () => {
	if (miningTxn) {
		const txnLink = await getEtherscanLink(miningTxn);
		setTxnLink(txnLink);
	} else {
		setTxnLink(null);
	}
};

export const getAllTasks = async () => {
	setLoadingMessage("Loading tasks");
	const contract = getContract();

	let tasks = await contract.getAllTasks();
	// console.log("Got all tasks...", tasks);

	// copy tasks to itself, to enable modification
	tasks = tasks.map((task) => {
		return { ...task };
	});

	// array to store finished tasks
	let finishedTasks = [];
	for (var task of tasks) {
		if (task.done) {
			finishedTasks.push(task);
			// remove task from tasks
			tasks.splice(tasks.indexOf(task), 1);
		}
	}
	// add finished tasks to the end of tasks
	tasks.push(...finishedTasks);

	setAllTasks(tasks);
	setLoadingMessage(null);
};

export const addTask = async () => {
	if (!newTask) {
		setLoadingMessage("Task is empty!");
		return;
	}
	setLoadingMessage("Adding task");
	console.log("adding a newTask: ", newTask);

	const contract = getContract();

	const txn = await contract.addTask(newTask);
	await txn.wait();
	setNewTask("");
	getAllTasks();
	setLoadingMessage(null);
};

export const finishTask = async (taskId) => {
	// event.preventDefault();
	setLoadingMessage("Finishing task...");

	const contract = getContract();

	const txn = await contract.finishTask(taskId);
	setMiningTxn(txn);
	await txn.wait();
	setLoadingMessage("Done");

	getAllTasks();
};

export const deleteTask = async (taskPos) => {
	// event.preventDefault();
	setLoadingMessage("Deleting task..,");

	const contract = getContract();

	const txn = await contract.deleteTask(taskPos);
	setMiningTxn(txn);
	await txn.wait();
	setLoadingMessage("Done");

	getAllTasks();
};

export const depositEth = async (taskPos) => {
	// event.preventDefault();
	setLoadingMessage("Depositing ETH to task...");

	const contract = getContract();
	const txn = await contract.deposit(taskPos, {
		value: parseEther("0.01"),
	});
	setMiningTxn(txn);
	await txn.wait();
	setLoadingMessage("Done");

	getAllTasks();
};

export const refundToOwner = async () => {
	setLoadingMessage("Refunding to owner...");

	const contract = getContract();
	const txn = await contract.refundToOwner();
	setMiningTxn(txn);
	await txn.wait();
	setLoadingMessage("Done");

	getAllTasks();
};

export const verifyOwner = async () => {
	const contract = getContract();
	const owns = await contract.isOwner();
	setIsOwner(owns);
};

// press enter to add task
export const submitOnEnter = (event) => {
	if (event.key === "Enter") {
		addTask(event);
	}
};
