import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";

import { data, handleMint, imageSize, pricePerToken } from "Components/ContractFunctions";
import Utils from "Commons/Utils";
import config from "Assets/ContractABI.json"
import contractAddresses from "Assets/ContractAddresses.json"
const utils = new Utils(config, contractAddresses)


const Home = () => {
	const [mintingTxn, setMintingTxn] = useState(null);
	const [txnLink, setTxnLink] = useState(null);
	const [loadingMessage, setLoadingMessage] = useState(null);
	const [currency, setCurrency] = useState(null);
	const wallet = useWallet();

	useEffect(async () => {
		if (mintingTxn) {
			setTxnLink(await utils.getEtherscanLink(mintingTxn));
		} else {
			setTxnLink(null);
		}
	}, [mintingTxn]);
	useEffect(async () => {
		const connectedNetwork = await utils.getConnectedNetwork();
		if (connectedNetwork) {
			setCurrency(connectedNetwork.currency);
		}
	}, []);

	if (wallet.status !== 'connected') {
		return (
			<div className="container homeContainer">
				<br />
				<h2>🖼️ NFT Marketplace</h2>
				<p>Buy an NFT from our marketplace.</p>

				{window.ethereum ? (
					<button onClick={() => wallet.connect()}>Connect Wallet</button>
				) : (
					<p>Install Metamask wallet</p>
				)}
			</div>
		);
	}

	return (
		<div className="homeContainer">
			<h1 className="mt-5">🖼️ NFT Marketplace</h1>

			<div className="content-container mt-5 flex-vertical">
				{wallet.status !== 'connected' ? 'Please connect to metamask' : null}
			</div>
			
			<div className="container">
				{data.map(item => (
					<div className="imgDiv" key={item.id}>
						<img
							src={item.imageURL}
							key={item.id}
							alt="images"
							width={imageSize}
							height={imageSize}
						/>
						<button
							disabled={mintingTxn || !item.isAvailable}
							className={!item.isAvailable ? "button-sold-out" : ""}
							onClick={async (e) => {
								try {
									e.target.style.backgroundColor = "blue";
									await handleMint(item, setMintingTxn, setLoadingMessage);
									e.target.style.removeProperty("background-color");
								} catch (error) {
									console.error(error);
									item.isAvailable = true;
									setMintingTxn("");
									setLoadingMessage("Failed to mint. Please try again.");
								}
							}}
						>
							{item.isAvailable ?
								<> Mint - {pricePerToken} {currency} </>
							: "Sold"}
						</button>
					</div>
				))}
			</div>

			{loadingMessage ? (
				<div className="container">
					<h3>{loadingMessage}</h3>
					{txnLink ? (
						<p>
							<a href={txnLink} target="_blank">
								View on block explorer
							</a>
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
}

export default Home;
