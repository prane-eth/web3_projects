import { ethers, Contract } from "ethers";
import contractABI from "../assets/contractABI.json";

// const folderURL =
// 	"https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/";
const folderURL = "./assets/images/"
export const pricePerToken = 0.01;
export const imageSize = 250;

// create new list of NFTs
export const nftCount = 5;
export const data = [...Array(nftCount).keys()].map((i) => ({
	url: folderURL + (i + 1) + ".png",
}));

var account, setAccount, walletInstalled, setWalletInstalled,
	NFTContract, setNFTContract, mintingTxn, setMintingTxn;

export const bindNFTContract = () => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	setNFTContract(
		new Contract(contractABI.contractAddress, contractABI.abi, signer)
	);
};

export function setStateVariables(accountState, setAccountState,
		walletInstalledState, setWalletInstalledState, NFTContractState,
		setNFTContractState, mintingTxnState, setMintingTxnState) {
	account = accountState;
	setAccount = setAccountState;
	walletInstalled = walletInstalledState;
	setWalletInstalled = setWalletInstalledState;
	NFTContract = NFTContractState;
	setNFTContract = setNFTContractState;
	mintingTxn = mintingTxnState;
	setMintingTxn = setMintingTxnState;
}

export async function connectWallet() {
	window.ethereum
		.request({
			method: "eth_requestAccounts",
		})
		.then((accounts) => {
			setAccount(accounts[0]);
		})
		.catch((error) => {
			alert("Something went wrong");
			console.error(error);
		});
}

export async function withdrawMoney() {
	try {
		const response = await NFTContract.withdrawMoney();
		console.log("Started txn: ", response);
	} catch (err) {
		alert(err);
	}
}

export async function handleMint(tokenURI) {
	if (mintingTxn) {
		return;
	}
	setMintingTxn(true);
	try {
		const options = { value: ethers.utils.parseEther(""+pricePerToken) };
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