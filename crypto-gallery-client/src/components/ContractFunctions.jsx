import { ethers } from "ethers";

import Utils from "Commons/Utils";
import config from "Assets/ContractABI.json"
import contractAddresses from "Assets/ContractAddresses.json"
const utils = new Utils(config, contractAddresses)

const { parseEther, formatEther } = ethers;

// constants
export const imageSize = "280em";
const imagesURL = `https://ipfs.io/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/`;
const metadataURL = `https://ipfs.io/ipfs/QmWZdF6MjqXk3mZHFiWgZ5rkR4GPnc38MCpUYcCbyhZs4L/`;
// `https://gateway.pinata.cloud/ipfs/${ipfsFolder}/`;


// functions
export async function isAvailable(tokenUrl) {
	const contract = await utils.getContract();
	const available = contract.isAvailable(tokenUrl);
	return available;
}

export async function handleMint(item, setMintingTxn, setLoadingMessage) {
	setMintingTxn(true);
	const tokenURI = metadataURL + item.id + ".json";
	console.log("tokenURI", tokenURI);

	const available = await isAvailable(tokenURI);
	if (!available) {
		alert("Token URI not available");
		return;
	}

	// // fetch with timeout
	// const response = await fetch(tokenURI, { timeout: 5000 });
	// if (!response.ok) {
	// 	const confirmed = window.confirm("Token URI not reachable. Continue?");
	// 	if (!confirmed) {
	// 		return;
	// 	}
	// }

	try {
		const contract = await utils.getContract();
		const txn = await contract.mintNFT(tokenURI, { value: parseEther("" + pricePerToken) });
		setLoadingMessage("Minting NFT...");
		setMintingTxn(txn);
		await txn.wait();
		setLoadingMessage("Minted NFT!");
		item.isAvailable = false;
	} catch (error) {
		if (error.code != "ACTION_REJECTED") {  // 4001 ACTION_REJECTED if transaction rejected
			alert(error);
		}
	}
}

// wait for wallet to get unlocked
// await window.ethereum.enable();
// await window.ethereum.request({ method: 'eth_requestAccounts' });

// show wallet popup to unlock wallet
// const provider = new ethers.BrowserProvider(window.ethereum);
// const hasWalletPermissions = await provider.send('wallet_getPermissions');
// console.log('hasWalletPermissions', hasWalletPermissions);

const contract = await utils.getContract();
const price = await contract.PRICE_PER_TOKEN();
console.log("price", price);
export const pricePerToken = formatEther("" + price).toString();

// create new list of NFTs
export const data = [];
const nftCount = await contract.MAX_SUPPLY();
for (let i = 1; i <= nftCount; i++) {
	const available = await isAvailable(metadataURL + i + ".json");
	console.log("available", available);
	data.push({
		id: i,
		imageURL: imagesURL + i + ".png",
		metadataURL: metadataURL + i + ".json",
		isAvailable: available
	});
}
