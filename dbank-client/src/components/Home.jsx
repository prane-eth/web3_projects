import { useState, useEffect } from "react";
import { ethers } from "ethers";
import getContract from "./Utils";

const Home = ({ setLoadingMessage, account }) => {
	const [accountExists, setAccountExists] = useState(false);
	const [accountBalance, setAccountBalance] = useState(null);

	const createBankAccount = async () => {
		console.log("Creating account...");
		setLoadingMessage("Creating account...");
		const contract = await getContract();
		const tx = await contract.createAccount();

		await tx.wait();
		setLoadingMessage("");
		setAccountExists(true);
	};
	const CreateAccountButton = () =>
		!accountExists ? (
			<button className="create-account-btn" onClick={createBankAccount}>
				Create Account
			</button>
		) : null;
	const AccountBalanceDiv = () => (
		<div className="account-balance">
			<p>Account Balance</p>
			{accountBalance ? (
				<p>{accountBalance} ETH</p>
			) : (
				"Fetching balance..."
			)}
		</div>
	);

	useEffect(() => {
		getContract().then((contract) => {
			contract.userHasAccount().then((hasAccount) => {
				setAccountExists(hasAccount);
				contract.getBalance().then((rawBalance) => {
					const balanceEther = ethers.utils.formatEther(rawBalance);
					setAccountBalance(balanceEther);
				});
			});
		});
	}, []);
	return (
		<>
			<div
				id="homepageDiv"
				className="content-container mt-5 flex-vertical"
			>
				{!account ? "Please connect to metamask" : null}
				<CreateAccountButton />
				<AccountBalanceDiv />
			</div>
		</>
	);
};

export default Home;
