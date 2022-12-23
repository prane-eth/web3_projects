import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { IoArrowBack } from "react-icons/io5";
import { BsPlusSquare } from "react-icons/bs";

import WalletButton from "./WalletFunctions";
import config from "../assets/ContractABI.json";
import { contractAddress } from "../assets/ContractAddress.json";


const CreateInvoice = () => {
	const navigateTo = useNavigate();
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

	const handleKeyPress = (e) => {
		// press enter to create invoice
		if (e.key === "Enter") {
			addInvoice(e);
		}
		// press escape to go back
		if (e.key === "Escape") {
			navigateTo("/")
		}
	};
	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, []);

	return (
		<div className="container">
			<div className="row">
				<div className="col-md-10 mt-5">
					<div className="card card-body">
						<WalletButton />
						Buyer PAN: {buyerPAN}
						{loadingMessage && (
							<div className="loading">{loadingMessage}...</div>
						)}
						<br />
						<br />

						<h3>Create Invoice</h3>
						<form onSubmit={addInvoice}>
							<input
								type="text"
								className="form-control mt-4"
								placeholder="Seller PAN"
								name="sellerPAN"
								onChange={(e) => setSellerPAN(e.target.value)}
								value={sellerPAN}
							/>
							<input
								type="text"
								className="form-control mt-2"
								placeholder="Amount in ETH"
								name="amount"
								onChange={(e) => setInvoiceAmount(e.target.value)}
								value={invoiceAmount}
							/>
							<button className="bottom-button btn btn-success mt-5">
								<BsPlusSquare /> Create
							</button>
							<Link to="/" className="bottom-button btn btn-danger mt-5 ml-5">
								<IoArrowBack /> {" "} Cancel
							</Link>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CreateInvoice;
