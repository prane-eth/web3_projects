#!/bin/bash

folder="$1"
createContractArg="$2"
createClientArg="$3"
emptyValues=("false" "none" "null" "skip" "no" "n" "0" "-")

# if empty, ask for input
# $folder
if [ "$folder" == "" ]; then
	read -p "Folder name: " folder
fi
if [ "$createContractArg" == "" ]; then
	read -p "Create contract? (y/N) " -n 1 -r
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		createContract="true"
	else
		createContract="false"
	fi
else
	# if some value and not false or none or null, assume true
	if [[ ! " ${emptyValues[@]} " =~ " ${createContractArg} " ]]; then
		createContract="true"
	else
		createContract="false"
	fi
fi

# if REPLY is not enter key, print extra line
if [[ $REPLY != "" ]]; then
	echo
fi

if [ "$createClientArg" == "" ]; then
	read -p "Create client? (y/N) " -n 1 -r
	if [[ $REPLY =~ ^[Yy]$ ]]; then
		createClient="true"
	else
		createClient="false"
	fi
else
	if [[ ! " ${emptyValues[@]} " =~ " ${createClientArg} " ]]; then
		createClient="true"
	else
		createClient="false"
	fi
fi

if [[ $REPLY != "" ]]; then
	echo
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
# # add V1 to contract name
# contractName="$contractName""V1"

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

read -p "Enter contract name: [$contractName] " -n 1 -r
if [[ $REPLY != "" ]]; then
	contractName=$REPLY
fi

solidityVersion="0.8.19"

# ask for confirmation
echo "Creating project with folder name $folder"
echo "Create contract: $createContract"
echo "Create client: $createClient"
echo "Folder name: $folder"
echo "Contract name: $contractName"
echo "Solidity version: $solidityVersion"
read -p "Are you sure? (Y/n) " -n 1 -r
if [[ $REPLY =~ ^[Nn]$ ]]; then
	echo
	echo "Aborted"
	exit 1
fi


# ______________________________________________________________________________________

# if client is requested
if [ "$createClient" == "true" ]; then
    echo "Creating a Vite+React app in $folder-client"
	yes 'y' | head -n 1 | npm create vite@latest "$folder-client" -- --template react
    # npx create-react-app "$folder-client"
    cd "$folder-client"
	# remove dependencies as it causes installation error after adding use-wallet
	# remove line 12 and 13 in package.json
	sed -i '12 d' package.json
	sed -i '12 d' package.json
    npm i ethers sass react-icons @mui/material @emotion/react @emotion/styled @mui/icons-material use-wallet # react-router-dom

    # make package.json suitable with npm start command
    # # add comma at end of line 9
    # sed -i '9 s/$/,/' package.json
    # # add to package.json line 10
    # sed -i '10 i "start": "vite serve --port 3000"' package.json
    # # add tab at start of line 10
    # sed -i '10 s/^/    /' package.json

	# add in line 9. add tab before "start"
	sed -i '8 i "start": "vite serve --port 3000",' package.json
	sed -i '8 s/^/    /' package.json
	# sed -i '8 s/^/    /' package.json

	mkdir -p src/components src/assets
    rm src/assets/*
    rm src/App.css

    # ContractABI.json
    echo "{
    \"abi\": [
    ]
}" > src/assets/ContractABI.json

    # ContractAddress.json
    echo "{
	\"mumbaiAddress\": \"\",
	\"sepoliaAddress\": \"\"
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

.homeContainer {
	color: white;
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

body {
	margin: 0;
	padding: 0;
}

.darkmode {
	transition: 1s;
	background: radial-gradient(
		circle,
		rgba(30, 30, 30, 1) 0%,
		rgba(60, 60, 60, 1) 67%
	);
	color: white;
	#navbar {
		background-color: black;
	}
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

	# if App.js exists, rename it to jsx
	if [ -f src/App.js ]; then
		mv src/App.js src/App.jsx
	fi

	# App.js
    echo "import { useState } from \"react\";
import { BrowserRouter as Router, Route, Routes } from \"react-router-dom\";
import { UseWalletProvider } from 'use-wallet'

import Home from \"./components/Home\";
import Navbar from \"./components/Navbar\";
import { supportedNetworks } from \"./components/Utils\";
import \"./App.scss\";

const App = () => {
	const [account, setAccount] = useState(null);
	const [darkMode, setDarkMode] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState(null);
	const allSupportedNetworks = Object.keys(supportedNetworks);
	const supportedArray = allSupportedNetworks.map(network => ({chainId: network}))

	return (
		<UseWalletProvider chainId={allSupportedNetworks[0]} providerOptions={{supportedArray}}>
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
		</UseWalletProvider>
	);
};
export default App;" > src/App.jsx

    # components/Home.jsx
    echo "import { useState, useEffect } from \"react\";
import { useWallet } from \"use-wallet\";

import { getOwner } from \"./ContractFunctions\";
import { getEtherscanLink, getConnectedNetwork } from \"./Utils\";

const Home = () => {
	const [miningTxn, setMiningTxn] = useState(null);
	const [txnLink, setTxnLink] = useState(null);
	const [loadingMessage, setLoadingMessage] = useState(null);
	const [currency, setCurrency] = useState(null);
	const wallet = useWallet();

	useEffect(async () => {
		if (miningTxn) {
			setTxnLink(await getEtherscanLink(miningTxn));
		} else {
			setTxnLink(null);
		}
	}, [miningTxn]);
	// useEffect(async () => {  // if we need to display currency somewhere
	// 	const connectedNetwork = await getConnectedNetwork();
	// 	if (connectedNetwork) {
	// 		setCurrency(connectedNetwork.currency);
	// 	}
	// }, []);

	if (wallet.status !== 'connected') {
		return (
			<div className=\"container homeContainer\">
				<br />
				<h2> $contractName </h2>
				<p>
					{/* add contract description here */}
				</p>

				{window.ethereum ? (
					<button onClick={() => wallet.connect()}>Connect Wallet</button>
				) : (
					<p>Install Metamask wallet</p>
				)}
			</div>
		);
	}

	return (
		<div className=\"homeContainer\">
			<h1 className=\"mt-5\">Hello from $folder project</h1>

			<div className=\"content-container mt-5 flex-vertical\">
				{wallet.status !== 'connected' ? 'Please connect to metamask' : null}
			</div>

			<div className=\"container\">
				{/* add code for using contracts */}
			</div>

			{loadingMessage ? (
				<div className=\"container\">
					<h3>{loadingMessage}</h3>
					{txnLink ? (
						<p>
							<a href={txnLink} target=\"_blank\">
								View on block explorer
							</a>
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
};

export default Home;" > src/components/Home.jsx

	# ContractFunctions.js
	echo "import { ethers } from \"ethers\";
import { getContract } from \"./Utils\";

const { parseEther, formatEther } = ethers;

// wait for wallet to get unlocked
await window.ethereum.enable();
await window.ethereum.request({ method: 'eth_requestAccounts' });

// show wallet popup to unlock wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const hasWalletPermissions = await provider.send('wallet_getPermissions');
console.log('hasWalletPermissions', hasWalletPermissions);

" > src/components/ContractFunctions.js

    # components/Utils.js
    echo "import { ethers } from \"ethers\";

import config from \"../assets/ContractABI.json\";
import contractAddressJson from \"../assets/ContractAddress.json\";


if (!window.ethereum) {
	console.log('Make sure you have metamask!');
	alert('Make sure you have metamask!');
} else {
	// on network/account change, reload page
	window.ethereum.on('chainChanged', () => {
		window.location.reload();
	});
	window.ethereum.on('accountsChanged', () => {
		window.location.reload();
	});
}

export const supportedNetworks = {
	// please enter in lower case only
	'0x13881': {
		name: 'Mumbai', currency: 'MATIC',
		url: 'https://mumbai.polygonscan.com'
	},
	'0xaa36a7': {
		name: 'Sepolia', currency: 'ETH',
		url: 'https://sepolia.etherscan.io'
	},
	'0x7a69': {
		name: 'Localhost', currency: 'ETH',
		url: 'http://localhost:8545'
	},
}

export const getConnectedNetwork = async () => {
	if (!window.ethereum) {
		console.log('Make sure you have metamask!');
		return false;
	}

	// get connected network name
	const networkCode = await window.ethereum.request({ method: 'net_version' });
	// use ethers
	// const provider = new ethers.BrowserProvider(window.ethereum);
	// const networkCode = await provider.getNetwork().chainId;
	const network = networkCode.toLowerCase();
	if (!supportedNetworks[network]) {
		var networksList = Object.keys(supportedNetworks).map((key) => supportedNetworks[key].name);
		alert('Network not supported. Please switch to supported network: ' + networksList.join(', '));
		// request user to switch to Mumbai
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: Object.keys(supportedNetworks)[0] }],
		});
		return false;
	}

	return supportedNetworks[network];
};


export const getContract = async () => {
	if (!window.ethereum) {
		console.log(\"Make sure you have metamask!\");
		return false;
	}

	// get connected network name
	const { name: networkName } = await getConnectedNetwork();
	const networkNameInJson = networkName.toLowerCase() + 'Address';
	var contractAddress;
	if (networkNameInJson in contractAddressJson)
		contractAddress = contractAddressJson[networkNameInJson];
	else if (networkName === 'Localhost')
		contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
		// always the same first contract after starting a node
	else {
		alert("Network not supported for this contract");
		return false;
	}
	
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);
	return contract;
};

export const getEtherscanLink = async (miningTxn) => {
	const { url: domain } = await getConnectedNetwork();
	const hash = await miningTxn.hash;
	return `${domain}/tx/${hash}`;
};
" > src/components/Utils.js

    # components/Navbar.jsx
    echo "import { useState, useEffect } from \"react\";

import { ethers } from \"ethers\";
import { FaSun } from \"react-icons/fa\";
import { HiOutlineMoon } from \"react-icons/hi\";
import { MdOutlineAccountBalance } from \"react-icons/md\";
import { AiOutlineWallet } from \"react-icons/ai\";
import { SiBlockchaindotcom } from \"react-icons/si\";

import { getConnectedNetwork } from \"./Utils\";

const Navbar = ({ account, setAccount, darkMode, setDarkMode }) => {
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [balance, setBalance] = useState(null);
	const [accountShort, setAccountShort] = useState(null);
	const [network, setNetwork] = useState(null);
	const [currency, setCurrency] = useState(null);
	const wallet = useWallet()
    
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
				setAccount(window.ethereum.selectedAddress);
				setIsWalletInstalled(true);

				const walletBalance = await ethereum.request({
					method: \"eth_getBalance\",
					params: [window.ethereum.selectedAddress, \"latest\"],
				});
				if (walletBalance == 0x0) {
					setBalance('0.00');
				} else {
					const balance = ethers.formatEther(walletBalance);
					const balanceShort = balance.slice(0, 5);
					setBalance(balanceShort);
				}

				const connectedNetwork = await getConnectedNetwork();
				if (connectedNetwork === false)  return;
				setNetwork(connectedNetwork.name);
				setCurrency(connectedNetwork.currency);
				
			} else {
				console.log(\"No authorized account found\");
			}
		} catch (error) {
			console.error(error);
		}
	};

	// const connectWallet = async () => {
	// 	await window.ethereum
	// 		.request({
	// 			method: \"eth_requestAccounts\",
	// 		}).then(() => {
	// 			setAccount(window.ethereum.selectedAddress);
	// 		}).catch((error) => {
	// 			alert(\"Something went wrong\");
	// 		});
	// };

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
		wallet.connect();
	}, []);
	useEffect(() => {
		const accountShortValue = account ? account.slice(0, 6) + \"...\" + account.slice(-2) : null;
		setAccountShort(accountShortValue);
	}, [account]);

	return (
		<nav id=\"navbar\">
			<div className=\"emptyDiv\"></div>
			<h1>$contractName App</h1>
			<div id=\"walletDiv\" className=\"flex-horizontal\">
				<span className=\"darkModeToggle\" onClick={toggleDarkMode}>
					{darkMode ? <FaSun /> : <HiOutlineMoon />}
				</span>
				{wallet.status === 'connected' ? (
					<div className=\"connectedAs\" onClick={() => wallet.reset()} style={{ cursor: \"pointer\" }}>
						<div>
							<MdOutlineAccountBalance /> {accountShort}
						</div>
						{balance && (
							<div>
								<AiOutlineWallet /> {balance} {currency}
							</div>
						)}
						{network && (
							<div>
								<SiBlockchaindotcom /> {network}
							</div>
						)}
					</div>
				) : isWalletInstalled ? (
					<button
						id=\"connectMetamask\"
						className=\"btn btn-primary btn-lg active\"
						onClick={() => wallet.connect()}
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

	# main.jsx
	echo "import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
)
" > src/main.jsx

    cd ..
else
    echo "createClient is false"
fi

# ______________________________________________________________________________________

# if empty or some value exists, create contracts
if [ "$createContract" == "true" ]; then
	echo "Creating a Solidity project in $folder"
	mkdir -p "$folder"
	cd "$folder"
	if [ ! -f "package.json" ]; then
		npm init -y
	fi
	# npm i
	npm i hardhat @nomiclabs/hardhat-waffle chai dotenv @nomiclabs/hardhat-etherscan \
		@openzeppelin/contracts @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades
		# ethers @nomicfoundation/hardhat-toolbox ethereum-waffle @nomiclabs/hardhat-ethers

	# while running npx hardhat init, run yes '' for 4 times
	# to skip the questions
	yes '' | head -n 4 | awk '{print; system("sleep 1");}' | npx hardhat init
	# npx hardhat compile
	# npx hardhat test

	# if contracts folder does not exist, assume an interruption
	if [ ! -d "contracts" ]; then
		echo "interrupted"
		rm hardhat.config.js 2> /dev/null
		exit
	fi

	rm contracts/*
	rm scripts/*
	rm test/*

	echo "Creating files..."
	# add content to contracts/$contractName.sol
	echo "// SPDX-License-Identifier: MIT
pragma solidity ^$solidityVersion;

import \"@openzeppelin/contracts/access/Ownable.sol\";

contract $contractName is Ownable {
	constructor() {
		
	}
}" > contracts/$contractName.sol

	# add this content to hardhat.config.js
	echo "require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-upgrades');

const {
	GOERLI_RPC_URL,
	SEPOLIA_RPC_URL,
	MUMBAI_RPC_URL,
	PRIVATE_KEY,
	ETHERSCAN_API_KEY,
	POLYGONSCAN_API_KEY,
} = process.env;

module.exports = {
	solidity: '0.8.19',
	networks: {
		mumbai: {
			url: MUMBAI_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: [PRIVATE_KEY],
		},
		localhost: {
			url: 'http://localhost:8545',
			accounts: [
				// first private key when we run `npx hardhat node`
				'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
			],
		},
	},
	etherscan: {
		apiKey: {
			//ethereum
			mainnet: ETHERSCAN_API_KEY,
			ropsten: ETHERSCAN_API_KEY,
			goerli: ETHERSCAN_API_KEY,
			sepolia: ETHERSCAN_API_KEY,
			//polygon
			polygon: POLYGONSCAN_API_KEY,
			polygonMumbai: POLYGONSCAN_API_KEY,
		},
	},
};
" > hardhat.config.js

	# create .env file
	echo "GOERLI_RPC_URL=
SEPOLIA_RPC_URL=
MUMBAI_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
POLYGONSCAN_API_KEY=
" > .env

	# test file
	echo "
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { parseEther } = ethers.utils;
const { getBalance } = ethers.provider;

const deployContract = async (contractName, ...args) => {
	const contract = await ethers
		.getContractFactory(contractName)
		.then(contractFactory => contractFactory.deploy(...args));
	await contract.deployed();
	return contract;
};

// const deployProxy = async (contractName, ...args) => {
// 	const contract = await ethers
// 		.getContractFactory(contractName)
// 		.then(contractFactory => upgrades.deployProxy(contractFactory, [...args]));
// 	await contract.deployed();
// 	return contract;
// };

describe(\"$contractName\", function () {
	let contract;
	
	it(\"Should deploy without errors\", async function () {
		[owner] = await ethers.getSigners();
		contract = await deployContract(\"$contractName\");
		expect(contract.address).to.properAddress;
	});
});" > test/$folder.test.js

	# add content to scripts/run.js
	# 	echo "
	# const main = async () => {
	# 	const contract = await ethers.getContractFactory(\"$contractName\").then((contractFactory) => contractFactory.deploy());
	# 	await contract.deployed();
	# }

	# const runMain = async () => {
	# 	try {
	# 		await main();
	# 		process.exit(0);
	# 	} catch (error) {
	# 		console.error(error);
	# 		process.exit(1);
	# 	}
	# };

	# runMain();" > scripts/run.js

		# add content to scripts/deploy.js
		echo "const { ethers, network } = require(\"hardhat\");

const main = async () => {
	const contract = await ethers.getContractFactory(\"$contractName\").then((contractFactory) => contractFactory.deploy());
	await contract.deployed();
	console.log(\"Contract deployed address: \", contract.address, \"in network:\", hre.network.name);

	console.log('Contract source code could be verified on Etherscan/Polygonscan using the following command:');
	console.log(`npx hardhat verify --network \${network.name} \${contract.address}`);
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

	# add content to scripts/deployProxy.js
	echo "const { ethers, network, upgrades } = require('hardhat');

async function main() {
	const contractFactory = await ethers.getContractFactory(\"$contractName\");
	const proxy = await upgrades.deployProxy(contractFactory, []);
	// add args in array [], like [arg1, arg2, ...]
	await proxy.deployed();

	const implementationAddress = await upgrades.erc1967.getImplementationAddress(
		proxy.address
	);

	console.log('Proxy contract address: ' + proxy.address);
	console.log('Implementation contract address: ' + implementationAddress);

	console.log('Contract source code could be verified on Etherscan/Polygonscan using the following command:');
	console.log(`npx hardhat verify --network ${network.name} ${implementationAddress}`);
}

main();" > scripts/deployProxy.js

	# # if contractName has 1 at last, remove it. add 2
	# newContractName=${contractName%1}
	# newContractName=$newContractName"2"

	# add content to scripts/upgradeProxy.js
	echo "const { ethers, upgrades } = require('hardhat');

const proxyAddress = \"\";

async function upgrade() {
	const New$contractName = await ethers.getContractFactory(\"New$contractName\");
	const upgraded = await upgrades.upgradeProxy(proxyAddress, New$contractName);

	const implementationAddress =
		await upgrades.erc1967.getImplementationAddress(proxyAddress);

	console.log(\"The current contract owner is: \" + (await upgraded.owner()));
	console.log(\"Upgrade: Implementation contract address: \" + implementationAddress);
}
// async function downgrade() {  // downgrade if any security flaw or bugs in new version
// 	const $contractName = await ethers.getContractFactory(\"$contractName\");
// 	await upgrades.forceImport(proxyAddress, $contractName);
// 	console.log(\"V1 proxy contract registered for downgrading\");
// }

upgrade();" > scripts/upgradeProxy.js

	# add content to scripts/callContract.js
	echo "const { ethers } = require("hardhat");

async function main() {
	const contractAddr = '';
	const contract = await ethers.getContractAt('$contractName', contractAddr);

	console.log('Owner:', await contract.owner());
}

main();" > scripts/callContract.js

	echo "npx hardhat run scripts/run.js" > run.sh
	chmod +x run.sh
	echo "npx hardhat test" > test.sh
	chmod +x test.sh

	echo "Created Hardhat project in $folder"
else
	echo "createContract is false"
fi

if [ "$createClient" == "true" ]; then
    echo "Installed React in $folder-client"
fi
if [ "$createContract" == "true" ]; then
	echo "Installed Hardhat in $folder"
	echo "Please edit .env file with your RPC_URL and PRIVATE_KEY"
fi
