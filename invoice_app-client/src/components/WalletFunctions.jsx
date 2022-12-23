import { useState, useEffect } from "react";

import { ethers } from "ethers";

const WalletButton = (props) => {
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
			})
			.then((accounts) => {
				setAccount(accounts[0]);
			})
			.catch((error) => {
				alert("Something went wrong");
			});
	};

	useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
		checkIfWalletIsConnected();
	}, []);
	useEffect(() => {
		if (props.onRun) props.onRun();
	}, [account]);

	if (account) {
		return (
			<div className="connectedAs">
				<div>Connected as: {account}</div>
				{balance && (
					<div>Balance: {balance} ETH</div>
				)}
			</div>
		);
	} else {
		if (isWalletInstalled)
			return <button onClick={connectWallet}>Connect Wallet</button>;
		return <p>Install Metamask wallet</p>;
	}
};

export default WalletButton;
