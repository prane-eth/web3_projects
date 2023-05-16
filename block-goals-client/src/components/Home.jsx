import { useState, useEffect } from "react";

import { FaEthereum } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbCurrencyEthereum } from "react-icons/tb";
import { FaRegPlusSquare } from "react-icons/fa";
import { useWallet } from "use-wallet";

import {
	setNewTxnLink,
	getAllTasks,
	addTask,
	finishTask,
	deleteTask,
	depositEth,
} from "./ContractFunctions";

import Utils from "Commons/Utils";
import config from "Assets/ContractABI.json"
import contractAddresses from "Assets/ContractAddresses.json"
const utils = new Utils(config, contractAddresses)


const Home = ({ projectName }) => {
	const [allTasks, setAllTasks] = useState(null);
	const [newTask, setNewTask] = useState("");
	const [depositAmount, setDepositAmount] = useState(undefined);
	const [loadingMessage, setLoadingMessage] = useState(null);
	const [miningTxn, setMiningTxn] = useState(null);
	const [currency, setCurrency] = useState("MATIC/ETH");
	const [txnLink, setTxnLink] = useState(null);
	const wallet = useWallet();
	const allHooks = {
		allTasks, setAllTasks, newTask, setNewTask, depositAmount,
		setDepositAmount, loadingMessage, setLoadingMessage,
		miningTxn, setMiningTxn, txnLink, setTxnLink
	}
	const projectNameWithoutSpaces = projectName.replace(/\s/g, "");
	const projectNameKababCase = projectName.replace(/\s/g, "-").toLowerCase();

	const Instructions = () => (
		<div className="instructions">
			Instructions:
			<br />
			Add a task using the input box
			<br />
			Deposit your valuable {currency} to a task to increase your commitment
			to the goals
			<br />
			Finish a task by clicking on the checkbox and get your {currency} back
			(if any)
			<br />
			Note: It is recommended to enter at least 0.001 {currency} for a good commitment
		</div>
	);
	const submitOnEnter = (event) => {
		if (event.key === "Enter") {
			addTask(event);
		}
	}

	useEffect(() => {
		window.addEventListener("keydown", submitOnEnter);
		utils.getConnectedNetwork().then((connectedNetwork) => {
			if (connectedNetwork) {
				setCurrency(connectedNetwork.currency);
			}
		});

		// every 30 seconds, run getAllTasks
		const interval = setInterval(() => getAllTasks(allHooks), 30000);
		getAllTasks(allHooks);
		return () => {
			window.removeEventListener("keydown", submitOnEnter);
			clearInterval(interval);
		};
	}, []);

	useEffect(async () => {
		await setNewTxnLink(allHooks);
	}, [miningTxn]);

	if (wallet.status !== 'connected') {
		return (
			<div className='container homeContainer'>
				<br />
				<h2> {projectNameWithoutSpaces} </h2>
				<p>
					Become a chain-goaler
				</p>

				{window.ethereum ? (
					<button onClick={() => wallet.connect()}>Connect Wallet</button>
				) : (
					<p>Install Metamask wallet</p>
				)}
			</div>
		);
	}

	return (
		<div className='homeContainer'>
			<h1 className="mt-5 flex-horizontal">
				<span className="waving-item">👋</span>
				Hello from {projectNameKababCase} project
			</h1>
			<p className="flex-horizontal"> Become a chain-goaler </p>

			<div className="content-container mt-5 flex-vertical">
				{wallet.status !== 'connected' ? 'Please connect to metamask' : null}
			</div>

			<div className="container">
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
					<input
						id="amountInput"
						type="number"
						className="textInput amountInput"
						placeholder="Deposit amount"
						value={depositAmount}
						onChange={(event) => setDepositAmount(event.target.value)}
						style={{ color: depositAmount >= 0.001 ? "green" : "red" }}
					/>
					<button type="submit" onClick={() => addTask(allHooks)}>
						<FaRegPlusSquare color="white" size="24" />
					</button>
				</div>

				{allTasks == null && (
					<h3 className="mt-5"> Loading tasks... </h3>
				)}

				{allTasks != null && allTasks.length === 0 && (
					<h3 className="mt-5"> No tasks yet. Add a task to get started. </h3>
				)}

				{allTasks != null && (
					<div id="tasks">
						{allTasks.map((task, index) => (
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
										onChange={() => finishTask(index, allHooks)}
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
												onClick={() => depositEth(index, allHooks)}
											/>
										)}
										<MdDelete
											className="delete"
											onClick={() => deleteTask(index, allHooks)}
										/>
									</div>
								</div>
								{task.balance > 0 && (
									<div className="flex-horizontal">
										<div className="ethDisplay wave-on-hover">
											{task.balance} <FaEthereum />
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{loadingMessage ? (
				<div className="container">
					<h3>{loadingMessage}</h3>
					{txnLink ? (
						<p>
							<a href={txnLink} target="_blank">
								View on block explorer
							</a>
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
};

export default Home;
