import { useEffect, useState } from "react";
import "./App.css";
import {
	setStateVariables,
	connectWallet,
	withdrawMoney,
    handleMint,
    pricePerToken,
    imageSize,
    data,
	bindNFTContract
} from "./components/NftFunctions";

function App() {
	const [account, setAccount] = useState(null);
	const [walletInstalled, setWalletInstalled] = useState(false);
	const [NFTContract, setNFTContract] = useState(null);
	const [mintingTxn, setMintingTxn] = useState("");
	setStateVariables(
		account,
		setAccount,
		walletInstalled,
		setWalletInstalled,
		NFTContract,
		setNFTContract,
		mintingTxn,
		setMintingTxn
	);

	useEffect(() => {
		if (window.ethereum) {
			setWalletInstalled(true);
		}
	}, []);
	useEffect(() => {
		if (account) {
			bindNFTContract();
		}
	}, [account]);

	if (account === null) {
		return (
			<div className="container">
				<br />
				<h1> 🔮 metaschool</h1>
				<h2>NFT Marketplace</h2>
				<p>Buy an NFT from our marketplace.</p>

				{walletInstalled ? (
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
