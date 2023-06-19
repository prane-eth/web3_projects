import { ethers } from "ethers";

import config from "Assets/ContractABI.json";
import { mumbaiAddress } from "Assets/ContractAddress.json";


const getContract = async () => {
	if (!window.ethereum) {
		console.log("Make sure you have metamask!");
		return false;
	}
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(mumbaiAddress, config.abi, signer);
	return contract;
};

if (!localStorage.getItem('buyerPAN')) {
	localStorage.setItem('buyerPAN', 'BAJPC4350M')
}

export const buyerPAN = localStorage.getItem("buyerPAN");

export default getContract;