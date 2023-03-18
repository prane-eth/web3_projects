import { ethers } from "ethers";
import { getContract } from "./Utils";


const { parseEther, formatEther } = ethers;

export const imageSize = "280em";
const imagesURL = `https://ipfs.io/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/`;
const metadataURL = `https://ipfs.io/ipfs/QmWZdF6MjqXk3mZHFiWgZ5rkR4GPnc38MCpUYcCbyhZs4L/`;
// `https://gateway.pinata.cloud/ipfs/${ipfsFolder}/`;

const contract = await getContract();
const price = await contract.PRICE_PER_TOKEN();
export const pricePerToken = formatEther("" + price).toString();

export async function isAvailable(tokenUrl) {
	const available = contract.isAvailable(tokenUrl);
	return available;
}

// create new list of NFTs
export const data = [];
const nftCount = await contract.MAX_SUPPLY();
for (let i = 1; i <= nftCount; i++) {
	const available = await isAvailable(metadataURL + i + ".json");
	data.push({
		id: i,
		imageURL: imagesURL + i + ".png",
		metadataURL: metadataURL + i + ".json",
		isAvailable: available
	});
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
		const contract = await getContract();
		const txn = await contract.mintNFT(tokenURI, { value: parseEther("" + pricePerToken) });
		setLoadingMessage("Minting NFT...");
		setMintingTxn(txn);
		await txn.wait();
		setLoadingMessage("Minted NFT!");
		item.isAvailable = false;
	} catch (error) {
		if (error.code != "ACTION_REJECTED") {  // 4001 if transaction rejected
			alert(error);
		}
	}
}
