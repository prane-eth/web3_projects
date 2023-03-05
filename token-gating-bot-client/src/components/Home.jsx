import { useState, useEffect } from "react";
// import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";

const config = {
	apiKey: import.meta.env.VITE_APP_ALCHEMY_KEY,
	network: Network.MATIC_MAINNET
};
const alchemy = new Alchemy(config);

// assuming that the required NFT is https://opensea.io/assets/matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/2698
const ensContractAddress = "0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6";
const targetTokenId = "2698";

const Home = ({ setLoadingMessage, account }) => {
	const [ownsNFT, setOwnsNFT] = useState(null);
	const setAccount = async () => {
		setLoadingMessage("Loading...");
		try {
			const nfts = await alchemy.nft.getNftsForOwner(account, {
				contractAddresses: [ensContractAddress],
			});
			var accountOwnsNFT = false;
			for (let nft of nfts.ownedNfts) {
				if (nft.tokenId === targetTokenId) {
					accountOwnsNFT = true;
					break;
				}
			}
			setOwnsNFT(accountOwnsNFT);
		} catch (error) {
			console.error(error);
		}
		setLoadingMessage("");
	};

	const PageToDisplay = () => (
		<>
			<h1 className="mt-5">Thank you for buying the NFT</h1>
		</>
	)
	const AskToBuyNFT = () => (
		<>
			<h3 className="mt-5">The following NFT is required to access the website. Please buy the NFT.</h3>
			<a target="_blank" href={`https://opensea.io/assets/matic/${ensContractAddress}/${targetTokenId}`}>Buy NFT</a>
		</>
	)

	useEffect(() => {
		if (account) {
			setAccount();
		}
	}, [account]);

	return (
		<>
			<h1 className="mt-5">Hello from Token Gating Bot project</h1>

			<div className="content-container mt-5 flex-vertical">
				{!account ? "Please connect to metamask" : null}
				{account && (ownsNFT===true) ? <PageToDisplay /> : null}
				{account && (ownsNFT===false) ? <AskToBuyNFT /> : null}
			</div>
		</>
	);
};

export default Home;
