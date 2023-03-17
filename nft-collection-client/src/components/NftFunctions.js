import { ethers, Contract } from "ethers";
import ContractABI from "../assets/ContractABI.json";
import ContractAddress from "../assets/ContractAddress.json";

const { parseEther } = ethers;

const folderURL =
	"https://ipfs.io/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/";
	// "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/";
export const pricePerToken = 0.01;
export const imageSize = 250;

// create new list of NFTs
export const nftCount = 5;
export const data = [...Array(nftCount).keys()].map((i) => ({
	url: folderURL + (i + 1) + ".png"  // images[i],
}));

export async function withdrawEther(NFTContract) {
	try {
		const response = await NFTContract.withdrawEther();
		console.log("Started txn: ", response);
	} catch (err) {
		alert(err);
	}
}

export async function handleMint(NFTContract, tokenURI) {
	if (mintingTxn) {
		return;
	}
	setMintingTxn(true);
	try {
		const options = { value: parseEther(""+pricePerToken) };
		const txn = await NFTContract.mintNFT(tokenURI, options);
		console.log("Processing: ", txn);
		txn.tokenURI = tokenURI;
		setMintingTxn(txn);
		await txn.wait();
		console.log("Minted: ", txn);
	} catch (err) {
		alert(err);
	} finally {
		setMintingTxn(null);
	}
}