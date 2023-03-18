import { ethers } from "ethers";
import { getContract } from "./Utils";

const { parseEther } = ethers;
const folderURL =
	"https://ipfs.io/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/";
// "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/";
export const pricePerToken = 0.01;
export const imageSize = "280em";

// create new list of NFTs
export const nftCount = 5;
export const data = [];
for (let i = 0; i < nftCount; i++) {
	data.push({
		url: folderURL + (i + 1) + ".png",  // images[i],
	});
}

export async function withdrawEther(contract) {
	try {
		const response = await contract.withdrawEther();
		console.log("Started txn: ", response);
	} catch (err) {
		alert(err);
	}
}

export async function handleMint(tokenURI, mintingTxn, setMintingTxn) {
	if (mintingTxn) {
		return;
	}
	setMintingTxn(true);
	try {
		const contract = await getContract();
		const options = { value: parseEther("" + pricePerToken) };
		const txn = await contract.mintNFT(tokenURI, options);
		console.log("Processing: ", txn);
		txn.tokenURI = tokenURI;
		setMintingTxn(txn);
		await txn.wait();
		console.log("Minted");
	} catch (err) {
		alert(err);
	} finally {
		setMintingTxn(null);
	}
}
