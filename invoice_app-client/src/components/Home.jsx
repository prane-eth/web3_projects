import { useState, useEffect } from "react";
import config from '../assets/ContractABI.json'
import { contractAddress } from '../assets/ContractAddress.json'
import { ethers } from "ethers";

/* struct InvoiceData {
        string buyerPAN;
        string sellerPAN;
        uint256 invoiceAmount;
        uint256 invoiceDate;
        bool paid;
    } */
const Home = () => {
	const [account, setAccount] = useState(null);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);

	const [invoices, setInvoices] = useState([]);
	const [invoice, setInvoice] = useState({
		buyerPAN: "",
		sellerPAN: "",
		invoiceAmount: "",
		invoiceDate: "",
		paid: false,
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setInvoice({ ...invoice, [name]: value });
	};
	const addInvoice = async (e) => {
		e.preventDefault();
		return null;
	};
	const payInvoice = async (id) => {
		return null;
	}
	const getAllInvoices = async () => {
		return null;
	}

    const checkIfWalletIsConnected = async () => {
        if (account) {
            // console.log("account Already connected: ", account);
            return;
        }
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts) {
                setAccount(accounts[0]);
                setIsWalletInstalled(true);

                // get balance
                const balance = await ethereum.request({
                    method: "eth_getBalance",
                    params: [accounts[0], "latest"],
                });
                setBalance(ethers.utils.formatEther(balance));
                
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        setLoadingMessage("Connecting wallet");
		await window.ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts) => {
				setAccount(accounts[0]);
			})
			.catch((error) => {
				alert("Something went wrong");
			});
        setLoadingMessage(null);  
	};

    const returnWalletButton = () => {
        if (account) {
            return (
                <div className="connectedAs">
                    <p>Connected as: {account}</p>
                    {/* <p>Balance: {balance} ETH</p> */}
                </div>
            );
        }
        else {
            if (isWalletInstalled)
                return <button onClick={connectWallet}>Connect Wallet</button>;
            return <p>Install Metamask wallet</p>;
        }
    }

    useEffect(() => {
        if (window.ethereum) {
            setIsWalletInstalled(true);
        }
        checkIfWalletIsConnected();
        getAllInvoices();
    }, []);
    useEffect(() => {
        getAllInvoices();
    }, [account]);

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-8">
					{returnWalletButton()}
					<table className="table table-striped">
						<thead>
							<tr>
								<th>Name</th>
								<th>Amount</th>
								<th>Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{invoices.map((invoice) => (
								<tr key={invoice.id}>
									<td>{invoice.name}</td>
									<td>{invoice.amount}</td>
									<td>{invoice.date}</td>
									<td>
										{invoice.paid ? (
											<button className="btn btn-success">
												Paid
											</button>
										) : (
											<button className="btn btn-primary" onClick={() => payInvoice(invoice.id)}>
												Pay now
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Home;
