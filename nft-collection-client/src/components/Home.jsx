import { useState, useEffect } from "react";
import { useWallet } from "use-wallet";

import { data, handleMint, pricePerToken, imageSize } from "./NftFunctions";
import { getEtherscanLink } from "./Utils";


const Home = () => {
	const [mintingTxn, setMintingTxn] = useState("");
	const [txnLink, setTxnLink] = useState("");
	const wallet = useWallet();

	useEffect(() => {
		if (mintingTxn) {
			setTxnLink(getEtherscanLink(mintingTxn));
		} else {
			setTxnLink(null);
		}
	}, [mintingTxn]);

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
							onClick={async (e) => {
								e.target.style.backgroundColor = "blue";
								await handleMint(item.url, mintingTxn, setMintingTxn);
								e.target.style.removeProperty(
									"background-color"
								);
							}}
						>
							Mint - {pricePerToken} ETH
						</button>
					</div>
				))}
				{/* <button onClick={withdrawEther}>Withdraw Ether</button> */}
			</div>

			{txnLink && (
				<div className="container">
					<h3>Minting Transaction</h3>
					<p>
						<a href={txnLink}>
							View on Etherscan
						</a>
					</p>
				</div>
			)}
		</div>
	);
}

export default Home;
