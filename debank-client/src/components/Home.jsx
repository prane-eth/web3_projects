import { useState, useEffect } from "react";
import { ethers } from "ethers";
import getContract from "./Utils";

const Home = ({ setLoadingMessage, account }) => {
	return (
		<>
			<h1 className="mt-5">Hello from Debank project</h1>

			<div className="content-container mt-5 flex-vertical">
				{!account ? "Please connect to metamask" : null}
			</div>
		</>
	);
};

export default Home;
