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

export const getConnectedNetwork = async () => {
	if (!window.ethereum) {
		console.log('Make sure you have metamask!');
		return false;
	}

	// get connected network name
	const networkCode = await window.ethereum.request({ method: 'net_version' });
	// use ethers
	// const provider = new ethers.BrowserProvider(window.ethereum);
	// const networkCode = await provider.getNetwork().chainId;
	const network = networkCode.toLowerCase();
	if (!supportedNetworks[network]) {
		var networksList = Object.keys(supportedNetworks).map((key) => supportedNetworks[key].name);
		alert('Please switch to supported network: ' + networksList.join(', '));
		// request user to switch to Mumbai
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: Object.keys(supportedNetworks)[0] }],
		});
		return false;
	}

	return supportedNetworks[network];
};


const getContract = async () => {
	if (!window.ethereum) {
		console.log("Make sure you have metamask!");
		return false;
	}
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);
	return contract;
};

export default getContract;
