import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { FaSun, FaMoon } from "react-icons/fa";
import { buyerPAN } from "./Utils";

const Navbar = (props) => {
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [balance, setBalance] = useState(null);
	const [account, setAccount] = useState(null);

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
				setBalance(ethers.utils.formatEther(walletBalance));
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

	const DarkModeToggle = () => (
		<span className="darkModeToggle" onClick={toggleDarkMode}>
			{darkMode ? <FaSun /> : <FaMoon />}
		</span>
	)

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
	}, [account]);

	return (
		<>
			<DarkModeToggle />
			{account ? (
				<div className="connectedAs">
					<div>Connected as: {account}</div>
					{balance && (
						<div>Balance: {balance} ETH</div>
					)}
				</div>
			) : (
				isWalletInstalled ? (
					<button onClick={connectWallet}>Connect Wallet</button>
				) : (
					<p>Install Metamask wallet</p>
				)
			)}
			<p> Buyer PAN: {buyerPAN} </p>
		</>
	);
};

export default Navbar;
