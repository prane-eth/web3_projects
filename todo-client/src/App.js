// import logo from "./logo.svg";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import config from "./utils/Todo.json";
import "./App.css";

import { FaEthereum, FaMoon, FaSun } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbCurrencyEthereum } from "react-icons/tb";
import { FaRegPlusSquare } from "react-icons/fa";

const App = () => {
	const [allTasks, setAllTasks] = useState([]);
	const [account, setAccount] = useState(null);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [newTask, setNewTask] = useState("");
	const contractAddress = config.contractAddress;
	const contractABI = config.abi;
	const [darkMode, setDarkMode] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [balance, setBalance] = useState(null);

	const toggleDarkMode = () => {
		localStorage.setItem("darkMode", !darkMode);
		setDarkMode(!darkMode);
	};

	const checkIfWalletIsConnected = async () => {
		if (account) {
			// console.log("account Already connected: ", account);
			return;
		}
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Make sure you have metamask!");
				return;
			}

			const accounts = await ethereum.request({ method: "eth_accounts" });
			if (accounts) {
				setAccount(accounts[0]);
				setIsWalletInstalled(true);

				// get balance
				const balance = await ethereum.request({
					method: "eth_getBalance",
					params: [accounts[0], "latest"],
				});
				setBalance(ethers.utils.formatEther(balance));
			} else {
				console.log("No authorized account found");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const connectWallet = async () => {
		setLoadingMessage("Connecting wallet");
		await window.ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts) => {
				setAccount(accounts[0]);
			})
			.catch((error) => {
				alert("Something went wrong");
			});
		setLoadingMessage(null);
	};

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
	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			addTask(event);
		}
	};

	const returnWalletButton = () => {
		if (account) {
			return (
				<div className="connectedAs">
					<p>Connected as: {account}</p>
					<p>Balance: {balance} ETH</p>
				</div>
			);
		} else {
			if (isWalletInstalled)
				return <button onClick={connectWallet}>Connect Wallet</button>;
			return <p>Install Metamask wallet</p>;
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

	useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
		checkIfWalletIsConnected();
		getAllTasks();

		// get dark mode from local storage
		const localDarkMode = localStorage.getItem("darkMode");
		if (localDarkMode) setDarkMode(JSON.parse(localDarkMode));
		
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);
	useEffect(() => {
		getAllTasks();
	}, [account]);

	return (
		<div
			className={darkMode ? "mainContainer darkmode" : "mainContainer"}
			onKeyPress={handleKeyPress}
		>
			<div className="dataContainer">
				<div className="header">
					<span className="waving-item">👋</span>
					Hey there! <br />
					Welcome to TODO-list app
				</div>
				{returnWalletButton()}

				<Instructions />

				<div id="newTaskDiv">
					<input
						id="newTaskInput"
						type="text"
						className="textInput"
						placeholder="Enter a task"
						value={newTask}
						onChange={(event) => setNewTask(event.target.value)}
					/>
					<button type="submit" onClick={addTask}>
						<FaRegPlusSquare color="white" size="24" />
					</button>
				</div>

				{loadingMessage && (
					<div className="loading">{loadingMessage}...</div>
				)}

				<div id="tasks">
					{allTasks.map((task, index) => {
						let balance = ethers.utils.formatEther(task.balance);

						return (
							<div className="taskDivLarge" key={index}>
								<div
									className={
										task.done
											? "taskDiv taskDoneDiv"
											: "taskDiv"
									}
								>
									<input
										type="checkbox"
										checked={task.done}
										disabled={task.done}
										onChange={(event) =>
											finishTask(event, task.id)
										}
									/>
									{task.done ? (
										<s>{task.description}</s>
									) : (
										task.description
									)}
									<div className="right">
										{!task.done && (
											<TbCurrencyEthereum
												className="deposit"
												onClick={(event) =>
													depositEth(event, task.id)
												}
											/>
										)}
										<MdDelete
											className="delete"
											onClick={(event) =>
												deleteTask(event, task.id)
											}
										/>
									</div>
								</div>
								{balance > 0 && (
									<div className="ethDisplay wave-on-hover">
										{balance} <FaEthereum />
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			<span className="darkModeToggle" onClick={toggleDarkMode}>
				{darkMode ? <FaSun /> : <FaMoon />}
			</span>
		</div>
	);
};

export default App;
