#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide a folder name in the command line argument"
    exit 1
fi

folder="$1"
createContractArg="$2"
createClientArg="$3"

# if empty, assume false
# if some value and not false, assume true
if [ "$createContractArg" != "" ] && [ "$createContractArg" != "false" ]; then
	createContract="true"
else
	createContract="false"
fi
if [ "$createClientArg" != "" ] && [ "$createClientArg" != "false" ]; then
	createClient="true"
else
	createClient="false"
fi

# convert folder name to lower case
folder=$(echo "$folder" | tr '[:upper:]' '[:lower:]')
# replace spaces with hyphens
folder=${folder// /-}
# remove double hyphens as long as they exist
while [[ "$folder" =~ -- ]]; do
	folder=${folder//--/-}
done
# remove hyphen from start and end
folder=${folder#-}
folder=${folder%-}
# contract name is $folder with first letter in upper case
contractName=$(echo "$folder" | sed 's/\(.\)/\u\1/')
# convert kebab-case to CamelCase
contractName=$(echo "$contractName" | sed -r 's/(^|-)(.)/\U\2/g')

# ________________________________ Validations ________________________________

if [[ ${#folder} -lt 2 ]]; then
	echo "Folder name is too short"
	exit 1
fi

if [[ "$folder" =~ [^a-zA-Z0-9-] ]]; then
	echo "Folder name should not contain spaces or special characters"
	exit 1
fi

# if the folders exist, exit
if [ -d "$folder-client" ]; then
	echo "Client folder already exists"
	echo "Failed to create project"
	exit 1
fi
if [ -d "$folder" ]; then
	echo "Contract folder already exists"
	echo "Failed to create project"
	exit 1
fi
# ______________________________________________________________________________________

# if createContract value exists but not false 
if [ "$createClient" == "true" ]; then
    echo "Creating a React app in $folder-client"
    npm create vite@latest "$folder-client" -- --template react
    # npx create-react-app "$folder-client"
    cd "$folder-client"
    npm i
    npm i ethers react-router-dom sass react-icons
    mkdir -p src/components src/assets
    rm src/assets/*
    rm src/App.css

    # make package.json suitable with npm start command
    # add comma at end of line 9
    sed -i '9 s/$/,/' package.json
    # add to package.json line 10
    sed -i '10 i "start": "vite serve --port 3000"' package.json
    # add tab at start of line 10
    sed -i '10 s/^/    /' package.json

    # ContractABI.json
    echo "{
    \"abi\": [
    ]
}" > src/assets/ContractABI.json

    # ContractAddress.json
    echo "{
	\"contractAddress\": \"$folder.vh-praneeth.eth\"
}" > src/assets/ContractAddress.json

	echo "#navbar {
	/* align items to left, middle and right */
	display: flex;
	justify-content: space-between;
	align-items: center;
	top: 0;
	width: 97vw;
	margin-top: 1rem;

	// always display navbar on top of page
	position: sticky;
	z-index: 1;
	background: #f9f9f9;
	box-shadow: 0 0.5px 15px orange;
	border-radius: 0.5rem;
	padding: 0.5rem;
	margin-top: 0;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}

.mainContainer {
	transition: 1s;
	background: radial-gradient(
		circle,
		rgba(253, 255, 162, 1) 0%,
		rgba(229, 255, 204, 1) 67%
	);
	height: 100%;
    min-height: 100vh;

	display: flex;
	flex-direction: column;
	align-items: center;
}

.icon-large {
	font-size: 2rem;
	margin-right: 0.5rem;
}

#walletDiv {
	/* align items to left and right */
	display: flex;
	justify-content: space-between;
	align-items: center;
}

#connectMetamask {
	margin-right: 1rem;
	width: fit-content;
	box-shadow: 0 0.5px 15px blue;
	cursor: pointer;
	border-radius: 2em 2em 2em 2em;
	padding: 0.6rem;
	font-size: 1.1rem;
	font-weight: 600;
    color: white;
    background: #0a58ca;
}
.darkModeToggle {
	margin-right: 1rem;
	width: fit-content;
	box-shadow: 0 0.5px 15px grey;
	border-radius: 50%;
	padding: 0.6rem;
	cursor: pointer;
	&:hover {
		background: lightgrey;
	}
}

@mixin flex-layout {
	display: flex;
	justify-content: center;
	align-items: center;
}
.flex-horizontal {
	@include flex-layout;
	flex-direction: row;
}
.flex-vertical {
	@include flex-layout;
	flex-direction: column;
}

.darkmode {
	transition: 1s;
	background: radial-gradient(
		circle,
		rgba(30, 30, 30, 1) 0%,
		rgba(60, 60, 60, 1) 67%
	);
	color: white;
	.darkModeToggle {
		color: orange;
		box-shadow: 0 0.5px 15px orange;
		&:hover {
			background: slategrey;
		}
	}
	.darkModeToggleText, .i-am-text {
		color: black;
	}
	.navbar-links {
		a {
			color: violet;
		}
	}
	.sectionDiv {
		background: #333;
		color: white;
	}
	.sectionName {
		color: white;
	}
}" > src/App.scss

	echo ":root {
	font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
	font-size: 16px;
	line-height: 24px;
	font-weight: 400;

	font-synthesis: none;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	-webkit-text-size-adjust: 100%;
}

body {
	margin: 0;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
		'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
		sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}" > src/index.css

    echo "import { useState } from \"react\";
import { BrowserRouter as Router, Route, Routes } from \"react-router-dom\";

import Home from \"./components/Home\";
import Navbar from \"./components/Navbar\";
import \"./App.scss\";

const App = () => {
	const [account, setAccount] = useState(null);
	const [darkMode, setDarkMode] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState(null);

	return (
		<div className={darkMode ? \"mainContainer darkmode\" : \"mainContainer\"}>
			<div className=\"container text-center flex-vertical\">
				<Navbar
					account={account}
					setAccount={setAccount}
					darkMode={darkMode}
					setDarkMode={setDarkMode}
				/>
				<Router>
					<Routes>
						<Route
							path=\"/\"
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
					<div className=\"loading mt-5\">{loadingMessage}...</div>
				)}
			</div>
		</div>
	);
};
export default App;" > src/App.js*  # App.js or .jsx

    # components/Home.jsx
    echo "import { useState, useEffect } from \"react\";
import { ethers } from \"ethers\";
import getContract from \"./Utils\";

const Home = ({ setLoadingMessage, account }) => {
	return (
		<>
			<h1 className=\"mt-5\">Hello from Debank project</h1>

			<div className=\"content-container mt-5 flex-vertical\">
				{!account ? \"Please connect to metamask\" : null}
			</div>
		</>
	);
};

export default Home;" > src/components/Home.jsx

    # components/Utils.jsx
    echo "import { ethers } from \"ethers\";

import config from \"../assets/ContractABI.json\";
import { contractAddress } from \"../assets/ContractAddress.json\";

const getContract = async () => {
	if (!window.ethereum) {
		console.log(\"Make sure you have metamask!\");
		return false;
	}
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);
	return contract;
};

export default getContract;" > src/components/Utils.jsx

    # components/Navbar.jsx
    echo "import { useState, useEffect } from \"react\";

import { ethers } from \"ethers\";
import { FaSun } from \"react-icons/fa\";
import { HiOutlineMoon } from \"react-icons/hi\";
import { MdOutlineAccountBalance } from \"react-icons/md\";
import { AiOutlineWallet } from \"react-icons/ai\";

const Navbar = ({ account, setAccount, darkMode, setDarkMode }) => {
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [balance, setBalance] = useState(null);
	const [accountShort, setAccountShort] = useState(null);
    
	const checkIfWalletIsConnected = async () => {
		if (account) {
			return;
		}
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log(\"Make sure you have metamask!\");
				return;
			}

			const accounts = await ethereum.request({ method: \"eth_accounts\" });
			if (accounts) {
				setAccount(accounts[0]);
				setIsWalletInstalled(true);

				const walletBalance = await ethereum.request({
					method: \"eth_getBalance\",
					params: [accounts[0], \"latest\"],
				});
				const balance = ethers.utils.formatEther(walletBalance);
				const balanceShort = balance.slice(0, 5);
				setBalance(balanceShort);
			} else {
				console.log(\"No authorized account found\");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const connectWallet = async () => {
		await window.ethereum
			.request({
				method: \"eth_requestAccounts\",
			}).then((accounts) => {
				setAccount(accounts[0]);
			}).catch((error) => {
				alert(\"Something went wrong\");
			});
	};

	const toggleDarkMode = () => {
		localStorage.setItem(\"darkMode\", !darkMode);
		setDarkMode(!darkMode);
	};

	useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
		checkIfWalletIsConnected();

		const localDarkMode = localStorage.getItem(\"darkMode\");
		if (localDarkMode) setDarkMode(JSON.parse(localDarkMode));
	}, []);
	useEffect(() => {
		const accountShortValue = account ? account.slice(0, 6) + \"...\" + account.slice(-4) : null;
		setAccountShort(accountShortValue);
	}, [account]);

	return (
		<nav id=\"navbar\">
			<div className=\"emptyDiv\"></div>
			<h1>Debank App</h1>
			<div id=\"walletDiv\" className=\"flex-horizontal\">
				<span className=\"darkModeToggle\" onClick={toggleDarkMode}>
					{darkMode ? <FaSun /> : <HiOutlineMoon />}
				</span>
				{account ? (
					<div className=\"connectedAs\">
						<div>
							<MdOutlineAccountBalance /> {accountShort}
						</div>
						{balance && (
							<div>
								<AiOutlineWallet /> {balance} ETH
							</div>
						)}
					</div>
				) : isWalletInstalled ? (
					<button
						id=\"connectMetamask\"
						className=\"btn btn-primary btn-lg active\"
						onClick={connectWallet}
					>
						<AiOutlineWallet /> Connect Wallet
					</button>
				) : (
					<p>Install Metamask wallet</p>
				)}
			</div>
		</nav>
	);
};

export default Navbar;" > src/components/Navbar.jsx

    cd ..
else
    echo "createContract is mentioned. Skipping client creation"
fi

# ______________________________________________________________________________________

# if empty or some value exists, create contracts
if [ "$createContract" == "true" ]; then
	echo "Creating a Solidity project in $folder"
	mkdir -p "$folder"
	cd "$folder"
	npm init -y
	npm i
	npm i hardhat @nomicfoundation/hardhat-toolbox \
		@nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers \
		ethers dotenv # @openzeppelin/contracts
	echo "Press enter 3 times now"

	npx hardhat
	npx hardhat compile
	npx hardhat test

	rm contracts/*
	rm scripts/*
	rm test/*

	# add content to contracts/$contractName.sol
	echo "pragma solidity ^0.8.17;

contract $contractName {
	address public owner;

	constructor() {
		owner = msg.sender;
	}
}" > contracts/$contractName.sol

	# add this content to hardhat.config.js
	echo "require(\"@nomiclabs/hardhat-waffle\");
require(\"dotenv\").config();

const { RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
solidity: \"0.8.17\",
networks: {
	goerli: {
	url: RPC_URL,
	accounts: [PRIVATE_KEY]
	},
}
};" > hardhat.config.js

	# create .env file
	echo "RPC_URL=
PRIVATE_KEY=" > .env

	# add content to scripts/deploy.js
	echo "
const main = async () => {
	const contractFactory = await hre.ethers.getContractFactory(\"$contractName\");
	const contract = await contractFactory.deploy();
	await contract.deployed();
	console.log(\"Contract deployed address: \", contract.address, \"in network:\", hre.network.name);
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

runMain();" > scripts/deploy.js

	# add content to scripts/run.js
	echo "
const main = async () => {
	const contractFactory = await hre.ethers.getContractFactory(\"$contractName\");
	const contract = await contractFactory.deploy();
	await contract.deployed();
}

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

runMain();" > scripts/run.js

	echo "npx hardhat run scripts/run.js" > run.sh
	# echo "npx hardhat run scripts/deploy.js --network goerli" > deploy.sh
	chmod +x run.sh # deploy.sh

	echo "Created Hardhat project in $folder"
else
	echo "createClient is mentioned. Skipping contract creation"
fi

if [ "$createClient" == "true" ]; then
    echo "Installed React in $folder-client"
fi
if [ "$createContract" == "true" ]; then
	echo "Installed Hardhat in $folder"
fi
echo "Please edit .env file with your RPC_URL and PRIVATE_KEY"
