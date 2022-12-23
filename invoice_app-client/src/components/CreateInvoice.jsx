import { useState } from "react";

import { ethers } from "ethers";

import WalletButton from "./WalletFunctions";
import config from "../assets/ContractABI.json";
import { contractAddress } from "../assets/ContractAddress.json";


const CreateInvoice = () => {
	const [sellerPAN, setSellerPAN] = useState("");
	const [invoiceAmount, setInvoiceAmount] = useState("");
	const [loadingMessage, setLoadingMessage] = useState("");
	const buyerPAN = "123456";
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);

	const addInvoice = async (e) => {
		e.preventDefault();
		if (!sellerPAN || !invoiceAmount) {
			alert("Please fill all fields");
			return;
		}
		try {
			setLoadingMessage("Creating invoice");
			// parse ether for invoiceAmount
			await contract.addInvoice(
				buyerPAN,
				sellerPAN,
				ethers.utils.parseEther(invoiceAmount)
			);
			setSellerPAN("");
			setInvoiceAmount("");
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingMessage("");
		}
	};
	
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-4">
					<div className="card card-body">
						<WalletButton />
						{loadingMessage && (
							<div className="loading">{loadingMessage}...</div>
						)}

						<h3>Create Invoice</h3>
						<form onSubmit={addInvoice}>
							<div className="form-group">
								<input
									type="text"
									className="form-control"
									placeholder="Seller PAN"
									name="sellerPAN"
									onChange={(e) => setSellerPAN(e.target.value)}
									value={sellerPAN}
								/>
							</div>
							<div className="form-group">
								<input
									type="text"
									className="form-control"
									placeholder="Amount in ETH"
									name="amount"
									onChange={(e) => setInvoiceAmount(e.target.value)}
									value={invoiceAmount}
								/>
							</div>
							<button className="btn btn-primary btn-block">
								Create
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CreateInvoice;
