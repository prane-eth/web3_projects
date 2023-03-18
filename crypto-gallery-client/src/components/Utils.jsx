import { ethers } from "ethers";

import config from "../assets/ContractABI.json";
import contractAddressJson from "../assets/ContractAddress.json";

export const supportedNetworks = {
	"0x13881": {name: "Mumbai", currency: "MATIC"},
	"0xaa36a7": {name: "Sepolia", currency: "ETH"},
}

export const getConnectedNetwork = async () => {
	if (!window.ethereum) {
		console.log("Make sure you have metamask!");
		return false;
	}

	// get connected network name
	const network = await window.ethereum.request({ method: "net_version" });
	if (!supportedNetworks[network]) {
		var networksList = Object.keys(supportedNetworks).map((key) => supportedNetworks[key].name);
		alert("Please switch to supported network: " + networksList.join(", "));
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
	else
		return false;

	const provider = new ethers.BrowserProvider(window.ethereum);
	const signer = await provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);
	return contract;
};

export const getEtherscanLink = (mintingTxn, type = "transaction") => {
	const network = getConnectedNetwork();
	var domain;
	if (network === "Mumbai")
		domain = "https://mumbai.polygonscan.com";
	else if (network === "Sepolia")
		domain = "https://sepolia.etherscan.io";
	else
		return null;

	const hash = mintingTxn.hash;
	if (type === "transaction") {
		console.log(`${domain}/tx/${hash}`);
		return `${domain}/tx/${hash}`;
	} else if (type === "address") {
		return `${domain}/address/${hash}`;
	}
};

