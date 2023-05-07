import { useState } from "react";
import PropTypes from 'prop-types';
import { UseWalletProvider } from 'use-wallet'

import Navbar from "./Navbar";
import Utils from "./Utils";
import "./AppCommon.scss";


const AppCommon = ({ projectName, Home, config, contractAddresses }) => {
	const utils = new Utils()
	const allSupportedNetworks = Object.keys(utils.supportedNetworks);
	const supportedArray = allSupportedNetworks.map(chainId => ({ chainId }))
	
	const [darkMode, setDarkMode] = useState(false);

	return (
		<UseWalletProvider chainId={allSupportedNetworks[0]} providerOptions={{supportedArray}}>
			<div className={darkMode ? "mainContainer darkmode" : "mainContainer"}>
				<div className="container text-center flex-vertical">
					<Navbar
						darkMode={darkMode} setDarkMode={setDarkMode} projectName={projectName}
						config={config} contractAddresses={contractAddresses}
					/>
					<Home/>
				</div>
			</div>
		</UseWalletProvider>
	);
};

AppCommon.propTypes = {
	projectName: PropTypes.string.isRequired,
	Home: PropTypes.func.isRequired,
};

export default AppCommon;
