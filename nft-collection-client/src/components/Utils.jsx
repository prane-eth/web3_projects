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
	// const { name: networkName} = await getConnectedNetwork();
	// var contractAddress;
	// if (networkName === "Mumbai")
	// 	contractAddress = contractAddressJson.mumbaiAddress;
	// else if (networkName === "Sepolia")
	// 	contractAddress = contractAddressJson.sepoliaAddress;
	// else
	// 	return false;
	const contractAddress = contractAddressJson.mumbaiAddress;

	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);
	return contract;
};

export const getEtherscanLink = (mintingTxn, hash, type = "transaction") => {
	const networkId = mintingTxn?.networkId;
	const networkName = mintingTxn?.networkName;
	if (!networkId) {
		return "";
	}

	console.log("networkId", mintingTxn);

	if (type === "transaction") {
		return `https://${
			networkId === "1" ? "" : networkId + "."
			}etherscan.io/tx/${hash}`;
	} else if (type === "address") {
		return `https://${
			networkId === "1" ? "" : networkId + "."
			}etherscan.io/address/${hash}`;
	}
};

