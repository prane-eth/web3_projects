import { useState } from "react";

import { ethers } from "ethers";
import { Link } from "react-router-dom";
import {
	Button,
	Table,
} from "react-bootstrap";

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
		} catch (error) {
			console.error(error);
		}
		setLoadingMessage("");
	};

	return (
		<>
			<WalletButton onRun={getAllInvoices} />

			{loadingMessage && (
				<div className="loading">{loadingMessage}...</div>
			)}
			<Table>
				<thead>
					<tr>
						<th>Buyer PAN</th>
						<th>Seller PAN</th>
						<th>Amount</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{invoices.map((invoice, index) => {
						const invoiceAmountEther = ethers.utils.formatEther(
							invoice.invoiceAmount
						);
						const invoiceDateFormatted = new Date(
							invoice.invoiceDate * 1000
						).toLocaleDateString("en-IN");

						return (
							<tr key={index}>
								<td>{invoice.buyerPAN}</td>
								<td>{invoice.sellerPAN}</td>
								<td>{invoiceAmountEther}</td>
								<td>{invoiceDateFormatted}</td>
								<td>
									{invoice.paid ? (
										<Button className="btn btn-success">
											Paid
										</Button>
									) : (
										<Button
											className="btn btn-primary"
											onClick={() =>
												payInvoice(index)
											}
										>
											Pay now
										</Button>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
			<Link to="/createInvoice" className="btn btn-primary">
				Create Invoice
			</Link>
		</>
	);
};

export default Home;
