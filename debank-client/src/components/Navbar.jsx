import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { FaSun } from "react-icons/fa";
import { HiOutlineMoon } from "react-icons/hi";
import { MdOutlineAccountBalance } from "react-icons/md";
import { AiOutlineWallet } from "react-icons/ai";

const Navbar = ({ account, setAccount, darkMode, setDarkMode }) => {
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [balance, setBalance] = useState(null);
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
		const accountShortValue = account ? account.slice(0, 6) + "..." + account.slice(-4) : null;
		setAccountShort(accountShortValue);
	}, [account]);

	return (
		<nav id="navbar">
			<div className="emptyDiv"></div>
			<h1>Debank App</h1>
			<div id="walletDiv" className="flex-horizontal">
				<span className="darkModeToggle" onClick={toggleDarkMode}>
					{darkMode ? <FaSun /> : <HiOutlineMoon />}
				</span>
				{account ? (
					<div className="connectedAs">
						<div>
							<MdOutlineAccountBalance /> {accountShort}
						</div>
						{balance && (
							<div>
								<AiOutlineWallet /> {balance} ETH
							</div>
						)}
					</div>
				) : isWalletInstalled ? (
					<button
						id="connectMetamask"
						className="btn btn-primary btn-lg active"
						onClick={connectWallet}
					>
						<AiOutlineWallet /> Connect Wallet
					</button>
				) : (
					<p>Install Metamask wallet</p>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
