import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { AiOutlinePlus } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";

import Navbar from "./Navbar";
import getContract, { buyerPAN } from "./Utils";

const Home = () => {
	const navigateTo = useNavigate();
	const [loadingMessage, setLoadingMessage] = useState("");
	const [invoices, setInvoices] = useState([]);
	const [darkMode, setDarkMode] = useState(false);

	const payInvoice = async (index, amount) => {
		setLoadingMessage("Paying invoice");
		try {
			const contract = await getContract();
			const txn = await contract.payInvoiceByPAN(buyerPAN, index, {
				value: ethers.utils.parseEther(amount),
			});
			console.log("Mining...", txn.hash);
			await txn.wait();
			console.log("Mined");
			getAllInvoices();
		} catch (error) {
			console.error(error);
		}
		setLoadingMessage("");
	};
	const getAllInvoices = async () => {
		setLoadingMessage("Fetching invoices");
		try {
			const contract = await getContract();
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
		<div
			className={darkMode ? "mainContainer darkmode" : "mainContainer"}
		>
			<div className="container text-center">
				<Navbar onRun={getAllInvoices} darkMode={darkMode} setDarkMode={setDarkMode} />

				<div className="content-container mt-5">
					<table className="table table-striped mt-5">
						<thead>
							<tr>
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
				</div>
				<Link to="/createInvoice" className="btn btn-primary btn-lg active mt-5">
					<AiOutlinePlus /> Create Invoice
				</Link>
				{loadingMessage && (
					<div className="loading mt-5">{loadingMessage}...</div>
				)}
			</div></div>
	);
};

export default Home;
