import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./assets/contractABI.json";
import {
	initStateVariables,
	connectWallet,
	withdrawMoney,
    handleMint,
    pricePerToken,
    imageSize,
    data
} from "./components/NftFunctions";
import "./App.css";

function App() {
	const [account, setAccount] = useState(null);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [NFTContract, setNFTContract] = useState(null);
	const [mintingTxn, setMintingTxn] = useState("");
	initStateVariables(
		account,
		setAccount,
		isWalletInstalled,
		setIsWalletInstalled,
		NFTContract,
		setNFTContract,
		mintingTxn,
		setMintingTxn
	);

	useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
	}, []);

	useEffect(() => {
		if (!account) {
			return;
		}
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		setNFTContract(
			new Contract(contractABI.contractAddress, contractABI.abi, signer)
		);
	}, [account]);

	if (account === null) {
		return (
			<div className="container">
				<br />
				<h1> 🔮 metaschool</h1>
				<h2>NFT Marketplace</h2>
				<p>Buy an NFT from our marketplace.</p>

				{isWalletInstalled ? (
					<button onClick={connectWallet}>Connect Wallet</button>
				) : (
					<p>Install Metamask wallet</p>
				)}
			</div>
		);
	}

	return (
		<>
			<div className="container">
				<br />
				<h2> 🔮 NFT Marketplace </h2>
				{data.map((item, index) => (
					<div className="imgDiv" key={index}>
						<img
							src={item.url}
							key={index}
							alt="images"
							width={imageSize}
							height={imageSize}
						/>
						<button
							disabled={mintingTxn}
							onClick={(e) => {
								e.target.style.backgroundColor = "blue";
								handleMint(item.url);
								e.target.style.removeProperty(
									"background-color"
								);
							}}
						>
							Mint - {pricePerToken} eth
						</button>
					</div>
				))}
				<button onClick={withdrawMoney}>Withdraw Money</button>
			</div>
		</>
	);
}

export default App;
