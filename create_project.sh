#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide a folder name in the command line argument"
    exit 1
fi

folder="$1"
onlyContract="$2"

# convert folder name to lower case
folder=$(echo "$folder" | tr '[:upper:]' '[:lower:]')

# contract name is $folder with first letter in upper case
contractName=$(echo "$folder" | sed 's/\(.\)/\u\1/')

# ________________________________ Validations ________________________________

if [[ "$folder" =~ " " || "$folder" =~ [^a-zA-Z0-9] || ${#folder} -lt 2 ]]; then
  echo "Folder name should not contain spaces or special characters, and should have at least 2 characters"
  exit 1
fi

# ____________________________________________________________________

# if onlyContract is not empty, then only create the backend
if [ -z "$onlyContract" ] && [ "$onlyContract" != "false" ]; then
    echo "Creating a React app in $folder-client"
    npm create vite@latest "$folder-client" -- --template react
    # npx create-react-app "$folder-client"
    cd "$folder-client"
    npm i
    npm i ethers
    mkdir -p src/components src/assets
    rm src/assets/*
    echo "" > src/App.css
    echo "" > src/index.css

    echo "import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path=\"/\" element={<Home />} />
      </Routes>
    </Router>
  )
}
export default App" > src/App.js*  # App.js or .jsx

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

    # components/Home.jsx
    echo "import { useState, useEffect } from \"react\";
import { Link, useNavigate } from \"react-router-dom\";
import { ethers } from \"ethers\";
import Navbar from \"./Navbar\";
import getContract from \"./Utils\";

const Home = () => {
	const navigateTo = useNavigate();
	const [account, setAccount] = useState(null);

	return (
		<div className={darkMode ? \"mainContainer darkmode\" : \"mainContainer\"}>
			<div className=\"container text-center\">
                <Navbar
                    account={account}
                    setAccount={setAccount}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
                <h1 className=\"mt-5\">Hello from $contractName project</h1>

				<div className=\"content-container mt-5 flex-vertical\">
					{!account ? \"Please connect to metamask\" : null}
                </div>
                {loadingMessage && (
                    <div className="loading mt-5">
                        {loadingMessage}...
                    </div>
                )}
            </div>
        </div>
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
			<h1>Invoice App</h1>
			<div id=\"walletDiv\">
				<span className=\"darkModeToggle\" onClick={toggleDarkMode}>
					{darkMode ? <FaSun /> : <HiOutlineMoon />}
				</span>
				{account ? (
					<div className=\"connectedAs\">
						<div><MdOutlineAccountBalance /> {accountShort}</div>
						{balance && (
							<div><AiOutlineWallet /> {balance} ETH</div>
						)}
					</div>
				) : (
					isWalletInstalled ? (
						<button id=\"connectMetamask\" className=\"btn btn-primary btn-lg active\" onClick={connectWallet}>
							<AiOutlineWallet /> Connect Wallet
						</button>
					) : (
						<p>Install Metamask wallet</p>
					)
				)}
			</div>
		</nav>
	);
};

export default Navbar;" > src/components/Navbar.jsx

    cd ..
else
    echo "onlyContract is mentioned. Skipping client creation"
fi


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
echo "const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory(\"$contractName\");
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(\"Contract deployed address: \", contract.address);
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
echo "const main = async () => {
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

if [ -z "$onlyContract" ] && [ "$onlyContract" != "false" ]; then
    echo "Installed React in $folder-client"
fi
echo "Installed Hardhat in $folder"
echo "Please edit .env file with your RPC_URL and PRIVATE_KEY"
