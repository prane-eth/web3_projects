#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide a folder name in the command line argument"
    exit 1
fi

folder="$1"
onlyBackend="$2"

# if $folder contains upper case letters, warn and exit
folder_lower=$(echo "$folder" | tr '[:upper:]' '[:lower:]')
if [ "$folder" != "$folder_lower" ]; then
    echo "Folder name should be all lower case"
    exit 1
fi

# if onlyBackend is not empty, then only create the backend
if [ -z "$onlyBackend" ]; then
    echo "Creating a React app in $folder-client"
    # npm create vite@latest "$folder-client" -- --template react
    npx create-react-app "$folder-client"
    cd "$folder-client"
    npm i ethers
    cd ..
else
    echo "onlyBackend is mentioned. Skipping client creation"
fi


echo "Creating a Solidity project in $folder"
mkdir -p "$folder"
cd "$folder"
npm init -y
npm install hardhat
echo "Press enter 3 times now"
npx hardhat

# npm install @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers dotenv @openzeppelin/contracts
npx hardhat compile
npx hardhat test

echo "Installed Hardhat in $folder"
