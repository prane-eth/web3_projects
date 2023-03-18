import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";

import { data, handleMint, imageSize, pricePerToken } from "./NftFunctions";
import { getEtherscanLink, getConnectedNetwork } from "./Utils";


const Home = () => {
	const [mintingTxn, setMintingTxn] = useState("");
	const [txnLink, setTxnLink] = useState("");
	const [loadingMessage, setLoadingMessage] = useState("");
	const [currency, setCurrency] = useState("");
	const wallet = useWallet();

	useEffect(() => {
		if (mintingTxn) {
			setTxnLink(getEtherscanLink(mintingTxn));
		} else {
			setTxnLink(null);
		}
	}, [mintingTxn]);
	useEffect(async () => {
		const connectedNetwork = await getConnectedNetwork();
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
				{wallet.status !== 'connected' ? "Please connect to metamask" : null}
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
						{item.name}
						<button
							disabled={mintingTxn || !item.isAvailable}
							onClick={async (e) => {
								console.log(item.isAvailable)
								e.target.style.backgroundColor = "blue";
								await handleMint(item.url, setMintingTxn, setLoadingMessage);
								e.target.style.removeProperty("background-color");
							}}
						>
							{item.isAvailable ?
								<> Mint - {pricePerToken} {currency} </>
							: "Sold Out"}
						</button>
					</div>
				))}
			</div>

			{txnLink && (
				<div className="container">
					<h3>{loadingMessage}</h3>
					<p>
						<a href={txnLink}>
							View on block explorer
						</a>
					</p>
				</div>
			)}
		</div>
	);
}

export default Home;
