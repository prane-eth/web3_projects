import { useState, useEffect } from "react";

import { useWallet } from "use-wallet";
import { ethers } from "ethers";

import { FaSun } from "react-icons/fa";
import { HiOutlineMoon } from "react-icons/hi";
import { MdOutlineAccountBalance } from "react-icons/md";
import { AiOutlineWallet } from "react-icons/ai";
import { SiBlockchaindotcom } from "react-icons/si";

import Utils from "./Utils";
const getConnectedNetwork = new Utils('', '').getConnectedNetwork;
import './Navbar.scss';


const Navbar = ({ darkMode, setDarkMode, projectName }) => {
	const [account, setAccount] = useState(null);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [balance, setBalance] = useState(null);
	const [accountShort, setAccountShort] = useState(null);
	const [network, setNetwork] = useState(null);
	const [currency, setCurrency] = useState(null);
	const wallet = useWallet()

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
				setAccount(window.ethereum.selectedAddress);
				setIsWalletInstalled(true);

				const walletBalance = await ethereum.request({
					method: "eth_getBalance",
					params: [window.ethereum.selectedAddress, "latest"],
				});
				if (walletBalance == 0x0) {
					setBalance('0.00');
				} else {
					const balance = ethers.formatEther(walletBalance);
					const balanceShort = balance.slice(0, 5);
					setBalance(balanceShort);
				}

				const connectedNetwork = await getConnectedNetwork();
				if (connectedNetwork === false) return;
				setNetwork(connectedNetwork.name);
				setCurrency(connectedNetwork.currency);

			} else {
				console.log("No authorized account found");
			}
		} catch (error) {
			console.error(error);
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
		const accountShortValue = account ? account.slice(0, 6) + "..." + account.slice(-2) : null;
		setAccountShort(accountShortValue);
	}, [account]);

	return (
		<nav id="navbar">
			<div className="emptyDiv"></div>
			<h1>{projectName}</h1>
			<div id="walletDiv" className="flex-horizontal">
				<span className="darkModeToggle" onClick={toggleDarkMode}>
					{darkMode ? <FaSun /> : <HiOutlineMoon />}
				</span>
				{wallet.status === 'connected' ? (
					<div className="connectedAs" onClick={() => wallet.reset()} style={{ cursor: "pointer" }}>
						<div>
							<MdOutlineAccountBalance /> {accountShort}
						</div>
						{balance && (
							<div>
								<AiOutlineWallet /> {balance} {currency}
							</div>
						)}
						{network && (
							<div>
								<SiBlockchaindotcom /> {network}
							</div>
						)}
					</div>
				) : isWalletInstalled ? (
					<button
						id="connectMetamask"
						className="btn btn-primary btn-lg active"
						onClick={() => wallet.connect()}
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
