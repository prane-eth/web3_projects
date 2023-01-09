import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Navbar from "./Navbar";
import getContract from "./Utils";

const Home = () => {
	const navigateTo = useNavigate();
	const [account, setAccount] = useState(null);

	return (
		<div className={darkMode ? "mainContainer darkmode" : "mainContainer"}>
			<div className="container text-center">
                <Navbar
                    account={account}
                    setAccount={setAccount}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
                <h1 className="mt-5">Hello from Debank project</h1>

				<div className="content-container mt-5 flex-vertical">
					{!account ? "Please connect to metamask" : null}
                </div>
                {loadingMessage && (
                    <div className=loading mt-5>
                        {loadingMessage}...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
