import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { FaSun } from "react-icons/fa";
import { HiOutlineMoon } from "react-icons/hi";
import { MdOutlineAccountBalance } from "react-icons/md";
import { AiOutlineWallet } from "react-icons/ai";

import getContract from "./Utils";

const Navbar = ({ account, setAccount, darkMode, setDarkMode }) => {
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [balanceShort, setBalanceShort] = useState(null);
	const [accountExists, setAccountExists] = useState(false);
	const [accountBalance, setAccountBalance] = useState(null);
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
				setBalanceShort(balance.slice(0, 5));
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
			})
			.then((accounts) => {
				setAccount(accounts[0]);
			})
			.catch((error) => {
				alert("Something went wrong");
			});
	};

	const toggleDarkMode = () => {
		localStorage.setItem("darkMode", !darkMode);
		setDarkMode(!darkMode);
	};

	const disconnectWallet = async () => {
		// TODO: add option to disconnect metamask wallet
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
		getContract().then((contract) => {
			if (accountExists) {
				// if Home component is not mounted
				if (document.getElementById("homepageDiv") === null) {
					contract.getBalance().then((bankBalance) => {
						bankBalance = ethers.utils.formatEther(bankBalance);
						setAccountBalance(bankBalance);
					});
				}
			}
		});
	}, [account, accountExists]);
	useEffect(() => {
		const accountShortValue = account
			? account.slice(0, 6) + "..." + account.slice(-4)
			: null;
		setAccountShort(accountShortValue);

		if (account) {
			setIsWalletInstalled(true);
			ethereum
				.request({
					method: "eth_getBalance",
					params: [account, "latest"],
				})
				.then((walletBalance) => {
					const balance = ethers.utils.formatEther(walletBalance);
					setBalanceShort(balance.slice(0, 5));
				});

			getContract().then((contract) => {
				contract.userHasAccount().then((hasAccount) => {
					setAccountExists(hasAccount);
					contract.getBalance().then((rawBalance) => {
						const balanceEther = ethers.utils.formatEther(rawBalance);
						setAccountBalance(balanceEther);
					});
				});
			});
		}
	}, [account]);

	return (
		<nav id="navbar">
			<div className="emptyDiv">
				{/* Account balance: {bankBalance} ETH */}
				{accountBalance && (
					<div className="bankBalance">
						<AiOutlineWallet /> {accountBalance} ETH
					</div>
				)}
			</div>
			<h1>Debank App</h1>
			<div id="walletDiv" className="flex-horizontal">
				<span className="darkModeToggle" onClick={toggleDarkMode}>
					{darkMode ? <FaSun /> : <HiOutlineMoon />}
				</span>
				{account ? (
					<div className="connectedAs">
						<div>
							<MdOutlineAccountBalance
								onClick={disconnectWallet}
							/>{" "}
							{accountShort}
						</div>
						{balanceShort && (
							<div>
								<AiOutlineWallet /> {balanceShort} ETH
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
