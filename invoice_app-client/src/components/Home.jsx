import { useState } from "react";

import { ethers } from "ethers";
import { Link } from "react-router-dom";

import WalletButton from "./WalletFunctions";
import config from "../assets/ContractABI.json";
import { contractAddress } from "../assets/ContractAddress.json";


const Home = () => {
	const [loadingMessage, setLoadingMessage] = useState("");

	const [invoices, setInvoices] = useState([]);

	const buyerPAN = "123456";
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);

	const payInvoice = async (id) => {
		setLoadingMessage("Paying invoice");
		try {
			await contract.payInvoiceByPAN(buyerPAN, id);
		} catch (error) {
			console.error(error);
		}
		setLoadingMessage("");
	};
	const getAllInvoices = async () => {
		setLoadingMessage("Fetching invoices");
		try {
			const invoices = await contract.getInvoicesByPAN(buyerPAN);
			setInvoices(invoices);
			console.log(invoices);
		} catch (error) {
			console.error(error);
		}
		setLoadingMessage("");
	};

	return (
		// make all content centered
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-8 text-center">
					<WalletButton onRun={getAllInvoices} />

					{loadingMessage && (
						<div className="loading">{loadingMessage}...</div>
					)}
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
							{invoices.map((invoice, index) => (
								<tr key={index}>
									<td>{invoice.buyerPAN}</td>
									<td>{invoice.sellerPAN}</td>
									<td>{ethers.utils.formatEther(invoice.invoiceAmount)}</td>
									<td>{invoice.invoiceDate}</td>
									<td>
										{invoice.paid ? (
											<button className="btn btn-success">
												Paid
											</button>
										) : (
											<button
												className="btn btn-primary"
												onClick={() =>
													payInvoice(index)
												}
											>
												Pay now
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<Link to="/createInvoice" className="btn btn-primary">
						Create Invoice
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
