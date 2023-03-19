import { useState } from "react";
import { UseWalletProvider } from 'use-wallet'

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { supportedNetworks } from "./components/Utils";
import "./App.scss";

const App = () => {
	const [account, setAccount] = useState(null);
	const [darkMode, setDarkMode] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState(null);
	const allSupportedNetworks = Object.keys(supportedNetworks);
	const supportedArray = allSupportedNetworks.map(network => ({chainId: network}))

	return (
		<UseWalletProvider chainId={allSupportedNetworks[0]} providerOptions={{supportedArray}}>
			<div className={darkMode ? "mainContainer darkmode" : "mainContainer"}>
				<div className="container text-center flex-vertical">
					<Navbar
						account={account}
						setAccount={setAccount}
						darkMode={darkMode}
						setDarkMode={setDarkMode}
					/>
					<Home
						setLoadingMessage={setLoadingMessage}
						account={account}
					/>
					{loadingMessage && (
						<div className="loading mt-5">{loadingMessage}...</div>
					)}
				</div>
			</div>
		</UseWalletProvider>
	);
};
export default App;
