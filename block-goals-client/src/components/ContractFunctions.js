import { ethers } from "ethers";
import { getContract } from "./Utils";

const { parseEther, formatEther } = ethers;

// wait for wallet to get unlocked
await window.ethereum.enable();
await window.ethereum.request({ method: 'eth_requestAccounts' });

// show wallet popup to unlock wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const hasWalletPermissions = await provider.send('wallet_getPermissions');
console.log('hasWalletPermissions', hasWalletPermissions);



const addTask = async () => {
	if (!newTask) {
		setLoadingMessage("Task is empty!");
		return;
	}
	setLoadingMessage("Adding task");
	console.log("adding a newTask: ", newTask);

	try {
		const { ethereum } = window;

		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const myContract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);

			let count = await myContract.getTaskCount();
			console.log("Tasks count...", count.toNumber());

			const txn = await myContract.addTask(newTask);
			console.log("Mining...", txn.hash);

			await txn.wait();
			console.log("Mined");

			count = await myContract.getTaskCount();
			console.log("Tasks count...", count.toNumber());

			setNewTask("");
			getAllTasks();
		} else {
			console.log("Ethereum object doesn't exist!");
		}
	} catch (error) {
		console.error(error);
	}
	setLoadingMessage(null);
};

const getAllTasks = async () => {
	setLoadingMessage("Loading tasks");
	try {
		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const myContract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);

			let tasks = await myContract.getAllTasks();
			// console.log("Got all tasks...", tasks);

			// copy tasks to itself
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
		} else {
			console.log("Ethereum object doesn't exist!");
		}
	} catch (error) {
		console.error(error);
	}
	setLoadingMessage(null);
};

const finishTask = async (event, taskId) => {
	setLoadingMessage("Finishing task");
	event.preventDefault();

	try {
		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const myContract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);

			const txn = await myContract.finishTask(taskId);
			console.log("Mining...", txn.hash);

			await txn.wait();
			console.log("Mined");

			getAllTasks();
		} else {
			console.log("Ethereum object doesn't exist!");
		}
	} catch (error) {
		console.error(error);
	}
	setLoadingMessage(null);
};

const deleteTask = async (event, taskId) => {
	setLoadingMessage("Deleting task");
	event.preventDefault();

	try {
		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const myContract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);

			const txn = await myContract.deleteTask(taskId);
			console.log("Mining...", txn.hash);

			await txn.wait();
			console.log("Mined");

			getAllTasks();
		} else {
			console.log("Ethereum object doesn't exist!");
		}
	} catch (error) {
		console.error(error);
	}
	setLoadingMessage(null);
};

const depositEth = async (event, taskId) => {
	setLoadingMessage("Depositing ETH to task");
	event.preventDefault();

	try {
		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const myContract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);

			const txn = await myContract.deposit(taskId, {
				value: ethers.utils.parseEther("0.01"),
			});
			console.log("Mining...", txn.hash);

			await txn.wait();
			console.log("Mined");

			getAllTasks();
		} else {
			console.log("Ethereum object doesn't exist!");
		}
	} catch (error) {
		console.error(error);
	}
	setLoadingMessage(null);
};

/*
// const refundToOwner = async () => {
//     try {
//         const { ethereum } = window;
//         if (ethereum) {
//             const provider = new ethers.providers.Web3Provider(ethereum);
//             const signer = provider.getSigner();
//             const myContract = new ethers.Contract(
//                 contractAddress,
//                 contractABI,
//                 signer
//             );

//             const txn = await myContract.refundToOwner();
//             console.log("Mining...", txn.hash);

//             await txn.wait();
//             console.log("Mined");

//             getAllTasks();
//         } else {
//             console.log("Ethereum object doesn't exist!");
//         }
//     } catch (error) {
//         console.error(error);
//     }
// };
// <button onClick={refundToOwner}>
//     Refund to owner
// </button>
*/

// press enter to add task
const submitOnEnter = (event) => {
	if (event.key === "Enter") {
		addTask(event);
	}
};

const Instructions = () => (
	<>
		<div className="instructions">
			Instructions:
			<br />
			Add a task using the input box
			<br />
			Deposit your valuable ETH to a task to increase your commitment
			to the goals
			<br />
			Finish a task by clicking on the checkbox and get your ETH back
			(if any)
		</div>
	</>
);