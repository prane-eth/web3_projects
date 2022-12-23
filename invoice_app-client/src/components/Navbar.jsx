import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { FaSun } from "react-icons/fa";
import { HiOutlineMoon } from "react-icons/hi";
import { MdOutlineAccountBalance } from "react-icons/md";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { AiOutlineWallet } from "react-icons/ai";
import { buyerPAN } from "./Utils";

const Navbar = (props) => {
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [balance, setBalance] = useState(null);
	const [account, setAccount] = useState(null);
	const [accountShort, setAccountShort] = useState(null);

	const checkIfWalletIsConnected = async () => {
		if (account) {
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

				const walletBalance = await ethereum.request({
					method: "eth_getBalance",
					params: [accounts[0], "latest"],
				});
				const balance = ethers.utils.formatEther(walletBalance);
				const balanceShort = balance.slice(0, 5);
				setBalance(balanceShort);
			} else {
				console.log("No authorized account found");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const connectWallet = async () => {
		await window.ethereum
			.request({
				method: "eth_requestAccounts",
			}).then((accounts) => {
				setAccount(accounts[0]);
			}).catch((error) => {
				alert("Something went wrong");
			});
	};

	// get darkMode, setDarkMode from props
	const { darkMode, setDarkMode, onRun } = props;

	const toggleDarkMode = () => {
		localStorage.setItem("darkMode", !darkMode);
		setDarkMode(!darkMode);
	};

	useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
		checkIfWalletIsConnected();

		const localDarkMode = localStorage.getItem("darkMode");
		if (localDarkMode) setDarkMode(JSON.parse(localDarkMode));
	}, []);
	useEffect(() => {
		if (onRun) onRun();
		const accountShortValue = account ? account.slice(0, 6) + "..." + account.slice(-4) : null;
		setAccountShort(accountShortValue);
	}, [account]);

	return (
		<nav id="navbar">
			<div id="panDiv">
				<p> <BsFillPersonLinesFill />: {buyerPAN} </p>
			</div>
			<h1>Invoice App</h1>
			<div id="walletDiv">
				<span className="darkModeToggle" onClick={toggleDarkMode}>
					{darkMode ? <FaSun /> : <HiOutlineMoon />}
				</span>
				{account ? (
					<div className="connectedAs">
						<div><MdOutlineAccountBalance /> {accountShort}</div>
						{balance && (
							<div><AiOutlineWallet /> {balance} ETH</div>
						)}
					</div>
				) : (
					isWalletInstalled ? (
						<button onClick={connectWallet}>Connect Wallet</button>
					) : (
						<p>Install Metamask wallet</p>
					)
				)}
			</div>
		</nav>
	);
};

export default Navbar;
