import { ethers } from "ethers";

import config from "../assets/ContractABI.json";
import contractAddressJson from "../assets/ContractAddress.json";

export const supportedNetworks = {
	// please enter in lower case only
	"0x13881": {
		name: "Mumbai", currency: "MATIC",
		url: "https://mumbai.polygonscan.com"
	},
	"0xaa36a7": {
		name: "Sepolia", currency: "ETH",
		url: "https://sepolia.etherscan.io"
	},
	"0x7a69": {
		name: "Localhost", currency: "ETH",
		url: "http://localhost:8545"
	},
}

if (!window.ethereum) {
	console.log("Make sure you have metamask!");
	alert("Make sure you have metamask!");
} else {
	// on network/account change, reload page
	window.ethereum.on("chainChanged", () => {
		window.location.reload();
	});
	window.ethereum.on("accountsChanged", () => {
		window.location.reload();
	});
}


export const getConnectedNetwork = async () => {
	if (!window.ethereum) {
		console.log("Make sure you have metamask!");
		return false;
	}

	// get connected network name
	const networkCode = await window.ethereum.request({ method: "net_version" });
	// use ethers
	// const provider = new ethers.BrowserProvider(window.ethereum);
	// const networkCode = await provider.getNetwork().chainId;
	const network = networkCode.toLowerCase();
	if (!supportedNetworks[network]) {
		var networksList = Object.keys(supportedNetworks).map((key) => supportedNetworks[key].name);
		alert("Please switch to supported network: " + networksList.join(", "));
		// request user to switch to Mumbai
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: Object.keys(supportedNetworks)[0] }],
		});
		return false;
	}

	return supportedNetworks[network];
};

export const getContract = async () => {
	if (!window.ethereum) {
		console.log("Make sure you have metamask!");
		return false;
	}

	// get connected network name
	const { name: networkName} = await getConnectedNetwork();
	var contractAddress;
	if (networkName === "Mumbai")
		contractAddress = contractAddressJson.mumbaiAddress;
	else if (networkName === "Sepolia")
		contractAddress = contractAddressJson.sepoliaAddress;
	else if (networkName === "Localhost")
		contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
		// always the same first contract after starting a node
	else
		return false;

	const provider = new ethers.BrowserProvider(window.ethereum);
	const signer = await provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);
	return contract;
};

export const getEtherscanLink = async (mintingTxn) => {
	const { url: domain } = await getConnectedNetwork();
	const hash = await mintingTxn.hash;
	return `${domain}/tx/${hash}`;
};

