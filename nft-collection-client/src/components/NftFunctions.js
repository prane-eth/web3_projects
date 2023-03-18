import { ethers } from "ethers";
import { getContract } from "./Utils";


const { parseEther, formatEther } = ethers;

const contract = await getContract();

export const imageSize = "280em";
const imagesURL = `https://ipfs.io/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/`;
const metadataURL = `https://ipfs.io/ipfs/QmWZdF6MjqXk3mZHFiWgZ5rkR4GPnc38MCpUYcCbyhZs4L/`;
// `https://gateway.pinata.cloud/ipfs/${ipfsFolder}/`;


// create new list of NFTs
export const data = [];
const nftCount = await contract.MAX_SUPPLY();
for (let i = 0; i < nftCount; i++) {
	const available = await contract.isAvailable(imagesURL + (i + 1) + ".png");
	data.push({
		id: i,
		imageURL: imagesURL + (i + 1) + ".png",
		name: "NFT #" + (i + 1),
		metadataURL: metadataURL + (i + 1) + ".json",
		isAvailable: available
	});
}

const price = await contract.PRICE_PER_TOKEN();
export const pricePerToken = formatEther("" + price).toString();

export async function handleMint(tokenID, setMintingTxn, setLoadingMessage) {
	setMintingTxn(true);
	const tokenURI = metadataURL + tokenID + ".json";
	try {
		const contract = await getContract();
		const txn = await contract.mintNFT(tokenURI, { value: parseEther("" + pricePerToken) });
		setLoadingMessage("Minting NFT...");
		setMintingTxn(txn);
		await txn.wait();
		setLoadingMessage("Minted NFT!");
	} catch (err) {
		alert(err);
	} finally {
		setMintingTxn(null);
	}
}
