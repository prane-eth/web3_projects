import { ethers } from "ethers";
import { getEtherscanLink, getContract } from "./Utils";

const { parseEther } = ethers;

var allTasks, newTask, loadingMessage, isOwner, miningTxn, txnLink;
var setAllTasks, setNewTask, setLoadingMessage, setIsOwner;
var setMiningTxn, setTxnLink;

export async function setHooks(hooks) {
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
}

// function to set a new transaction link
export async function setNewTxnLink() {
	if (miningTxn) {
		const txnLink = await getEtherscanLink(miningTxn);
		setTxnLink(txnLink);
	} else {
		setTxnLink(null);
	}
}

// function to get all tasks
export async function getAllTasks() {
	setLoadingMessage("Loading tasks");
	const contract = await getContract();

	let tasks = await contract.getAllTasks();

	tasks = tasks.map((task) => {
		return { ...task };
	});

	let finishedTasks = [];
	for (var task of tasks) {
		if (task.done) {
			finishedTasks.push(task);
			tasks.splice(tasks.indexOf(task), 1);
		}
	}

	tasks.push(...finishedTasks);

	setAllTasks(tasks);
	setLoadingMessage(null);
}

// function to add a new task
export async function addTask() {
	if (!newTask) {
		setLoadingMessage("Task is empty!");
		return;
	}
	setLoadingMessage("Adding task");
	console.log("adding a newTask: ", newTask);

	const contract = await getContract();

	const txn = await contract.addTask(newTask);
	await txn.wait();
	setNewTask("");
	getAllTasks();
	setLoadingMessage(null);
}

// function to finish a task
export async function finishTask(taskId) {
	setLoadingMessage("Finishing task...");

	const contract = await getContract();

	const txn = await contract.finishTask(taskId);
	setMiningTxn(txn);
	await txn.wait();
	setLoadingMessage("Done");

	getAllTasks();
}

// function to delete a task
export async function deleteTask(taskPos) {
	setLoadingMessage("Deleting task..,");

	const contract = await getContract();

	const txn = await contract.deleteTask(taskPos);
	setMiningTxn(txn);
	await txn.wait();
	setLoadingMessage("Done");

	getAllTasks();
}

// function to deposit ETH to a task
export async function depositEth(taskPos) {
	setLoadingMessage("Depositing ETH to task...");

	const contract = await getContract();
	const txn = await contract.deposit(taskPos, {
		value: parseEther("0.01"),
	});
	setMiningTxn(txn);
	await txn.wait();
	setLoadingMessage("Done");

	getAllTasks();
}

// function to refund to owner
export async function refundToOwner() {
	setLoadingMessage("Refunding to owner...");

	const contract = await getContract();
	const txn = await contract.refundToOwner();
	setMiningTxn(txn);
	await txn.wait();
	setLoadingMessage("Done");

	getAllTasks();
}

// function to verify owner
export async function verifyOwner() {
	const contract = await getContract();
	const owner = await contract.owner();
	setIsOwner(owner === window.ethereum.selectedAddress);
}

// function to add task on pressing enter key
export function submitOnEnter(event) {
	if (event.key === "Enter") {
		addTask(event);
	}
}
