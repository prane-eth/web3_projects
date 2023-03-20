import { ethers } from "ethers";
import { getEtherscanLink, getContract } from "./Utils";

import { useHooksContext } from "./HooksContext";


const { parseEther } = ethers;


// function to set a new transaction link
export const setNewTxnLink = async (miningTxn, setTxnLink) => {
	if (miningTxn) {
		const txnLink = await getEtherscanLink(miningTxn);
		setTxnLink(txnLink);
	} else {
		setTxnLink(null);
	}
};

// function to get all tasks
export async function getAllTasks() {
	const { setLoadingMessage, setAllTasks } = useHooksContext();
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
	const { setLoadingMessage, newTask, setNewTask, getAllTasks } = useHooksContext();
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
	const { setLoadingMessage, setMiningTxn, getAllTasks } = useHooksContext();
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
	const { setLoadingMessage, setMiningTxn, getAllTasks } = useHooksContext();
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
	const { setLoadingMessage, setMiningTxn, getAllTasks } = useHooksContext();
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
	const { setLoadingMessage, setMiningTxn, getAllTasks } = useHooksContext();
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
	const { setIsOwner } = useHooksContext();
	const contract = await getContract();
	const owner = await contract.owner();
	setIsOwner(owner === window.ethereum.selectedAddress);
}

// function to add task on pressing enter key
export function submitOnEnter(event) {
	const { addTask } = useHooksContext();
	if (event.key === "Enter") {
		addTask(event);
	}
}
