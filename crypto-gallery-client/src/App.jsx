import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

	return (
		<UseWalletProvider chainId={allSupportedNetworks[2]}>
			<div className={darkMode ? "mainContainer darkmode" : "mainContainer"}>
				<div className="container text-center flex-vertical">
					<Navbar
						account={account}
						setAccount={setAccount}
						darkMode={darkMode}
						setDarkMode={setDarkMode}
					/>
					<Router>
						<Routes>
							<Route
								path="/"
								element={
									<Home
										setLoadingMessage={setLoadingMessage}
										account={account}
									/>
								}
							/>
						</Routes>
					</Router>
					{loadingMessage && (
						<div className="loading mt-5">{loadingMessage}...</div>
					)}
				</div>
			</div>
		</UseWalletProvider>
	);
};
export default App;
