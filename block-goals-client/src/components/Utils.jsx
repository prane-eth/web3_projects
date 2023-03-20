import { ethers } from "ethers";

import config from "../assets/ContractABI.json";
import contractAddressJson from "../assets/ContractAddress.json";


if (!window.ethereum) {
	console.log('Make sure you have metamask!');
	alert('Make sure you have metamask!');
} else {
	// on network/account change, reload page
	window.ethereum.on('chainChanged', () => {
		window.location.reload();
	});
	window.ethereum.on('accountsChanged', () => {
		window.location.reload();
	});
}

export const supportedNetworks = {
	// please enter in lower case only
	'0x13881': {
		name: 'Mumbai', currency: 'MATIC',
		url: 'https://mumbai.polygonscan.com'
	},
	'0xaa36a7': {
		name: 'Sepolia', currency: 'ETH',
		url: 'https://sepolia.etherscan.io'
	},
	'0x7a69': {
		name: 'Localhost', currency: 'ETH',
		url: 'http://localhost:8545'
	},
}

const getProviderAndSigner = async () => {
	if (!window.ethereum) {
		console.log("MetaMask not installed; using read-only defaults");
		const provider = ethers.getDefaultProvider();
		const signer = undefined;
		return { provider, signer };
	} else {
		const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();
		return { provider, signer };
	}
};

export const getConnectedNetwork = async () => {
	if (!window.ethereum) {
		console.log('Make sure you have metamask!');
		return false;
	}

	// get connected network name
	let network = await window.ethereum.request({ method: "net_version" });
	// if networkCode is not in hex format, convert it to hex
	if (!network.startsWith("0x"))
		network = "0x" + parseInt(network).toString(16);
	if (!supportedNetworks[network]) {
		var networksList = Object.keys(supportedNetworks).map((key) => supportedNetworks[key].name);
		alert('Network not supported. Please switch to supported network: ' + networksList.join(', '));
		// request user to switch to Mumbai
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: Object.keys(supportedNetworks)[0] }],
		});
		return false;
	}

	return supportedNetworks[network];
};


export const getContract = async () => {
	// if (!window.ethereum) {
	// 	console.log("Make sure you have metamask!");
	// 	return false;
	// }

	// get connected network name
	const { name: networkName } = await getConnectedNetwork();
	const networkNameInJson = networkName.toLowerCase() + "Address";
	var contractAddress;
	if (networkNameInJson in contractAddressJson)
		contractAddress = contractAddressJson[networkNameInJson];
	else if (networkName === "Localhost")
		contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
	// always the same first contract after starting a node
	else {
		alert("Network not supported for this contract");
		return false;
	}

	const { provider, signer } = await getProviderAndSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);
	console.log("provider", provider);
	console.log("signer", signer);
	console.log("contract", contract);

	return contract;
};

export const getEtherscanLink = async (miningTxn) => {
	const { url: domain } = await getConnectedNetwork();
	const hash = await miningTxn.hash;
	return `${domain}/tx/${hash}`;
};

// // wait for wallet to get unlocked
// await window.ethereum.enable();
// await window.ethereum.request({ method: 'eth_requestAccounts' });

// // show wallet popup to unlock wallet
// const provider = new ethers.BrowserProvider(window.ethereum);
// const hasWalletPermissions = await provider.send('wallet_getPermissions');
// console.log('hasWalletPermissions', hasWalletPermissions);
