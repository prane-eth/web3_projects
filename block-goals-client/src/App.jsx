import { useState } from "react";
import { UseWalletProvider } from 'use-wallet'

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { supportedNetworks } from "./components/Utils";
import "./App.scss";

const App = () => {
	const [darkMode, setDarkMode] = useState(false);
	const allSupportedNetworks = Object.keys(supportedNetworks);
	const supportedArray = allSupportedNetworks.map(chainId => ({chainId}))

	return (
		<UseWalletProvider chainId={allSupportedNetworks[0]} providerOptions={{supportedArray}}>
			<div className={darkMode ? "mainContainer darkmode" : "mainContainer"}>
				<div className="container text-center flex-vertical">
					<Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>
					<Home/>
				</div>
			</div>
		</UseWalletProvider>
	);
};
export default App;
