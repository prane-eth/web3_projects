import { useState } from "react";
import { UseWalletProvider } from 'use-wallet'

import Navbar from "./components/Navbar";
import { urlBase } from "./components/constants";
import { supportedNetworks } from `${urlBase}/Utils.jsx`;
import "./AppCommon.scss";

const allSupportedNetworks = Object.keys(supportedNetworks);
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
