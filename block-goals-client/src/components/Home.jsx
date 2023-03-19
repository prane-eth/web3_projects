import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";

import { getOwner } from "./ContractFunctions";
import { getEtherscanLink } from "./Utils";

import { FaEthereum, FaMoon, FaSun } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbCurrencyEthereum } from "react-icons/tb";
import { FaRegPlusSquare } from "react-icons/fa";

const Home = () => {
	const [mintingTxn, setMintingTxn] = useState(null);
	const [txnLink, setTxnLink] = useState(null);
	const [loadingMessage, setLoadingMessage] = useState(null);
	const [currency, setCurrency] = useState(null);
	const wallet = useWallet();

	const [newTask, setNewTask] = useState("");
	const [allTasks, setAllTasks] = useState([]);

	useEffect(async () => {
		if (mintingTxn) {
			setTxnLink(await getEtherscanLink(mintingTxn));
		} else {
			setTxnLink(null);
		}
	}, [mintingTxn]);

	useEffect(() => {
		window.addEventListener("keydown", submitOnEnter);
		return () => {
			window.removeEventListener("keydown", submitOnEnter);
		};
	}, []);
	useEffect(() => getAllTasks(), [account]);

	if (wallet.status !== 'connected') {
		return (
			<div className='container homeContainer'>
				<br />
				<h2> BlockGoals </h2>
				<p>
					{/* add contract description here */}
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
			<h1 className="mt-5">
				<span className="waving-item">👋</span>
				Hello from block-goals project
			</h1>

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
					<button type="submit" onClick={addTask}>
						<FaRegPlusSquare color="white" size="24" />
					</button>
				</div>

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

				{allTasks.length === 0 && (
					<div className="taskDivLarge">
						<div className="taskDiv">
							No tasks yet. Add a task to get started.
						</div>
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
