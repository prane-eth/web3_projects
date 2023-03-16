import { useState, useEffect } from "react";
import "./App.scss";
import {
	handleMint,
} from "./components/NftFunctions";


const Home = ({ setLoadingMessage, account }) => {
	const [walletInstalled, setWalletInstalled] = useState(false);
	const [NFTContract, setNFTContract] = useState(null);
	const [mintingTxn, setMintingTxn] = useState("");

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
			<h1 className="mt-5">Hello from NftCollection project</h1>

			<div className="content-container mt-5 flex-vertical">
				{!account ? "Please connect to metamask" : null}
			</div>
			
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
				<button onClick={withdrawEther}>Withdraw Ether</button>
			</div>
		</>
	);
}

export default Home;
