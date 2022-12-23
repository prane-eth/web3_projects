import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { AiOutlinePlus } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";

import WalletButton from "./WalletFunctions";
import config from "../assets/ContractABI.json";
import { contractAddress } from "../assets/ContractAddress.json";

const Home = () => {
	const navigateTo = useNavigate();
	const [loadingMessage, setLoadingMessage] = useState("");
	const [invoices, setInvoices] = useState([]);

	const buyerPAN = "123456";
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddress, config.abi, signer);

	const payInvoice = async (index, amount) => {
		setLoadingMessage("Paying invoice");
		try {
			await contract.payInvoiceByPAN(buyerPAN, index, {
				value: ethers.utils.parseEther(amount),
			});
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

	// press enter to create invoice
	const handleKeyPress = (e) => {
		// press enter to create invoice
		if (e.key === "Enter") {
			navigateTo("/createInvoice");
		}
	};
	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<div className="container text-center mt-5">
			<WalletButton onRun={getAllInvoices} />

			Buyer PAN: {buyerPAN}

			<table className="table table-striped mt-5">
				<thead>
					<tr className="text-center">
						<th> Buyer PAN </th>
						<th> Seller PAN </th>
						<th> Amount </th>
						<th> Date </th>
						<th> Payment status </th>
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
								<td>{invoiceAmountEther} ETH</td>
								<td>{invoiceDateFormatted}</td>
								<td>
									{invoice.paid ? (
										<button className="btn btn-success">
											<GiCheckMark /> Paid
										</button>
									) : (
										<button className="btn btn-warning"
											onClick={() =>
												payInvoice(index, invoiceAmountEther)
											}
										>
											<FaEthereum /> Pay now
										</button>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<Link to="/createInvoice" className="btn btn-primary btn-lg active">
				<AiOutlinePlus /> Create Invoice
			</Link>
			{loadingMessage && (
				<div className="loading mt-5">{loadingMessage}...</div>
			)}
		</div>
	);
};

export default Home;
