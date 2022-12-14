import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

function App() {
    const [account, setAccount] = useState(null);
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);
    const [NFTContract, setNFTContract] = useState(null);
    const [mintingTxn, setMintingTxn] = useState("");
    const folderURL =
        "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/";
    // const folderURL = "./assets/images/"
    const pricePerToken = 0.01;
    const imageSize = 250;

    // create new list of NFTs
    const nftCount = 5;
    const data = [...Array(nftCount).keys()].map((i) => ({
        url: folderURL + (i + 1) + ".png",
    }));

    useEffect(() => {
        if (window.ethereum) {
            setIsWalletInstalled(true);
        }
    }, []);

    useEffect(() => {
        if (!account) {
            return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setNFTContract(
            new Contract(contractABI.contractAddress, contractABI.abi, signer)
        );
    }, [account]);

    async function connectWallet() {
        window.ethereum
            .request({
                method: "eth_requestAccounts",
            })
            .then((accounts) => {
                setAccount(accounts[0]);
            })
            .catch((error) => {
                alert("Something went wrong");
            });
    }

    async function withdrawMoney() {
        try {
            const response = await NFTContract.withdrawMoney();
            console.log("Started txn: ", response);
        } catch (err) {
            alert(err);
        }
    }

    async function handleMint(tokenURI) {
        if (mintingTxn) {
            return;
        }
        setMintingTxn(true);
        try {
            const options = { value: ethers.utils.parseEther(""+pricePerToken) };
            const txn = await NFTContract.mintNFT(tokenURI, options);
            console.log("Processing: ", txn);
            txn.tokenURI = tokenURI;
            setMintingTxn(txn);
            await txn.wait();
            console.log("Minted: ", txn);
        } catch (err) {
            alert(err);
        } finally {
            setMintingTxn(null);
        }
    }

    if (account === null) {
        return (
            <div className="container">
                <br />
                <h1> 🔮 metaschool</h1>
                <h2>NFT Marketplace</h2>
                <p>Buy an NFT from our marketplace.</p>

                {isWalletInstalled ? (
                    <button onClick={connectWallet}>Connect Wallet</button>
                ) : (
                    <p>Install Metamask wallet</p>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="container">
                <br />
                <h2> 🔮 NFT Marketplace </h2>
                {data.map((item, index) => (
                    <div className="imgDiv" key={index}>
                        <img
                            src={item.url}
                            key={index}
                            alt="images"
                            width={imageSize}
                            height={imageSize}
                        />
                        <button
                            disabled={mintingTxn}
                            onClick={(e) => {
                                e.target.style.backgroundColor = "blue";
                                handleMint(item.url);
                                e.target.style.removeProperty("background-color");
                            }}
                        >
                            Mint - {pricePerToken} eth
                        </button>
                    </div>
                ))}
                <button
                    onClick={withdrawMoney}
                >
                    Withdraw Money
                </button>
            </div>
        </>
    );
}

export default App;
