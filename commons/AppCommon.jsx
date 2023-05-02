import { useState } from "react";
import { UseWalletProvider } from 'use-wallet'

import "./AppCommon.scss";
import Navbar from "./Navbar";
import { urlBase } from "./components/constants";

// get Utils
import config from "../assets/ContractABI.json"
import contractAddress from "../assets/ContractAddress.json"

const Utils = await import(`${urlBase}/Utils.jsx`);
const utils = new Utils(config, contractAddress)

const allSupportedNetworks = Object.keys(utils.supportedNetworks);
const supportedArray = allSupportedNetworks.map(chainId => ({chainId}))


const AppCommon = ({ projectName, Home }) => {
	const [darkMode, setDarkMode] = useState(false);

	return (
		<UseWalletProvider chainId={allSupportedNetworks[0]} providerOptions={{supportedArray}}>
			<div className={darkMode ? "mainContainer darkmode" : "mainContainer"}>
				<div className="container text-center flex-vertical">
					<Navbar darkMode={darkMode} setDarkMode={setDarkMode} projectName={projectName} />
					<Home/>
				</div>
			</div>
		</UseWalletProvider>
	);
};
export default AppCommon;
