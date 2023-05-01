import { useState } from "react";
import { UseWalletProvider } from 'use-wallet'

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { urlBase } from "./components/constants";
import { supportedNetworks } from `${urlBase}/Utils.jsx`;
import "./App.scss";

const allSupportedNetworks = Object.keys(supportedNetworks);
const supportedArray = allSupportedNetworks.map(chainId => ({chainId}))

const App = () => {
	const [darkMode, setDarkMode] = useState(false);

	return (
		<UseWalletProvider chainId={allSupportedNetworks[0]} providerOptions={{supportedArray}}>
			<div className={darkMode ? "mainContainer darkmode" : "mainContainer"}>
				<div className="container text-center flex-vertical">
					<Navbar darkMode={darkMode} setDarkMode={setDarkMode} projectName="Block Goals" />
					<Home/>
				</div>
			</div>
		</UseWalletProvider>
	);
};
export default App;
