import { ethers } from "ethers";
const { parseEther, formatEther } = ethers;
import { urlBase } from "./constants";

import config from "../assets/ContractABI.json"
import contractAddress from "../assets/ContractAddress.json"

const Utils = await import(`${urlBase}/Utils.jsx`);
const utils = Utils(config, contractAddress)


export const setNewTxnLink = async ({miningTxn, setTxnLink}) => {
	if (miningTxn) {
		const txnLink = await utils.getEtherscanLink(miningTxn);
		setTxnLink(txnLink);
	} else {
		setTxnLink(null);
	}
};

const getTaskFromJson = (taskJson) => {
	// convert from {0: 1679228096n, 1: 'testing the project', 2: false, 3: 10000000000000000n}
	// to {timestamp: 1679228096n, description: 'testing the project', done: false, balance: 10000000000000000n}
	return {
		description: taskJson[1],
		done: taskJson[2],
		balance: formatEther(taskJson[3] || 0),
	};
};

export const getAllTasks = async ({setAllTasks}) => {
	const contract = await utils.getContract();

	let tasksJson = await contract.getAllTasks();
	if (tasksJson.length === 0) {
		setAllTasks([]);
		return;
	}

	const tasks = tasksJson.map(taskJson => getTaskFromJson(taskJson));
	if (!tasks) {
		setAllTasks([]);
		return;
	}
	let finishedTasks = [];
	for (var task of tasks) {
		if (task.done) {
			finishedTasks.push(task);
			tasks.splice(tasks.indexOf(task), 1);
		}
	}
	tasks.push(...finishedTasks);
	setAllTasks(tasks);
}

export const addTask = async ({ setLoadingMessage, newTask, setNewTask, depositAmount, setAllTasks, setMiningTxn }) => {
	newTask = newTask.trim();
	if (!newTask) {
		setLoadingMessage("Task is empty!");
		setTimeout(() => setLoadingMessage(null), 1000);
		return;
	}
	if (!depositAmount) {
		setLoadingMessage("Deposit amount is empty!");
		setTimeout(() => setLoadingMessage(null), 2000);
		return;
	}
	setLoadingMessage("Adding task...");
	console.info("adding a newTask: ", newTask);

	try {
		const contract = await utils.getContract();

		const txn = await contract.addTask(newTask, {
			value: parseEther(""+depositAmount),
		});
		setMiningTxn(txn);
		await txn.wait();
		setNewTask("");
		getAllTasks({setAllTasks});
		setLoadingMessage("Task added!");
		setMiningTxn(null);
	} catch (error) {
		console.error(error);
		setLoadingMessage("Error adding task");
		setMiningTxn(null);
	}
}

export const finishTask = async (taskPos, {setLoadingMessage, setMiningTxn, setAllTasks}) => {
	setLoadingMessage("Finishing task...");

	try {
		const contract = await utils.getContract();

		const txn = await contract.finishTask(taskPos);
		setMiningTxn(txn);
		await txn.wait();
		setLoadingMessage("Done");

		getAllTasks({ setAllTasks });
	} catch (error) {
		console.error(error);
		setLoadingMessage("Error finishing task");
	}
}

export const deleteTask = async (taskPos, {setLoadingMessage, setMiningTxn, setAllTasks}) => {
	setLoadingMessage("Deleting task...");

	try {
		const contract = await utils.getContract();
		const txn = await contract.deleteTask(taskPos);
		setMiningTxn(txn.hash);
		await txn.wait();
		setLoadingMessage("Task deleted!");
		getAllTasks({ setAllTasks });
	} catch (error) {
		console.error(error);
		setLoadingMessage("Error deleting task");
	}
}

export const depositEth = async (taskPos, {setLoadingMessage, setMiningTxn, setAllTasks}) => {
	setLoadingMessage("Depositing ETH to task...");

	try {
		const contract = await utils.getContract();
		const txn = await contract.deposit(taskPos, {
			value: parseEther("0.01"),
		});
		setMiningTxn(txn);
		await txn.wait();
		setLoadingMessage("Amount deposited!");

		getAllTasks({ setAllTasks });
	} catch (error) {
		console.error(error);
		setLoadingMessage("Error depositing amount");
	}
}


