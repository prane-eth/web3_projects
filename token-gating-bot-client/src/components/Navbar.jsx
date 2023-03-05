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
	const [currency, setCurrency] = useState("MATIC");

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
				// make user switch to polygon network
				const network = await window.ethereum.request({ method: "eth_chainId" });
				if (network !== "0x89") {
					await window.ethereum.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: "0x89" }],
					}).catch((error) => {
						alert("Something went wrong");
						console.error(error);
					});
				}
				setAccount(window.ethereum.selectedAddress);
				setIsWalletInstalled(true);

				const walletBalance = await ethereum.request({
					method: "eth_getBalance",
					params: [window.ethereum.selectedAddress, "latest"],
				});
				const currencyValue = await ethereum.request({
					method: "eth_chainId",
				});
				if (currencyValue === "0x89" || currencyValue === "0x13881") {
					setCurrency("MATIC");
				} else {
					setCurrency("ETH");
				}
				if (walletBalance == 0x0 || walletBalance === "0x187c99de7e564ce0") {
					setBalance('0.00');
				} else {
					const balance = ethers.utils.formatEther(walletBalance);
					if (balance.length > 5) {
						const balanceShort = balance.slice(0, 5);
						setBalance(balanceShort);
					} else {
						setBalance(balance);
					}
				}
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
			}).then(() => {
				setAccount(window.ethereum.selectedAddress);
			}).catch((error) => {
				alert("Something went wrong");
			});
		// make user switch to polygon network
		const network = await window.ethereum.request({ method: "eth_chainId" });
		if (network !== "0x89") {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0x89" }],
			}).catch((error) => {
				alert("Something went wrong");
				console.error(error);
			});
		}
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
		const accountShortValue = account ? account.slice(0, 7) + "..." + account.slice(-2) : null;
		setAccountShort(accountShortValue);
	}, [account]);

	return (
		<nav id="navbar">
			<div className="emptyDiv"></div>
			<h1>Token Gating Bot App</h1>
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
								<AiOutlineWallet /> {balance} {currency}
							</div>
						)}
						<button
							className="btn btn-primary btn-lg active"
							onClick={() => {
								setAccount(null);
								setBalance(null);
							}}
						>
							Disconnect
						</button>
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
