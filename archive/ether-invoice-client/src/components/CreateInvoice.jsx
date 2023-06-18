import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { IoArrowBack } from "react-icons/io5";
import { BsPlusSquare } from "react-icons/bs";

import Navbar from "./Navbar";
import getContract, { buyerPAN } from "./Utils";

const CreateInvoice = () => {
	const navigateTo = useNavigate();
	const [sellerPAN, setSellerPAN] = useState("");
	const [invoiceAmount, setInvoiceAmount] = useState("");
	const [loadingMessage, setLoadingMessage] = useState("");
	const [darkMode, setDarkMode] = useState(false);
	const [account, setAccount] = useState(null);

	const addInvoice = async (e) => {
		e.preventDefault();
		if (!sellerPAN || !invoiceAmount) {
			alert("Please fill all fields");
			return;
		}
		if (!validatePAN(sellerPAN)) {
			alert("Invalid Seller PAN");
			return;
		}
		// check if invoice amount is valid
		if (isNaN(invoiceAmount) || invoiceAmount <= 0) {
			alert("Invalid invoice amount");
			return;
		}
		setLoadingMessage("Creating invoice");
		try {
			const contract = await getContract();
			// parse ether for invoiceAmount
			const txn = await contract.addInvoice(
				buyerPAN,
				sellerPAN,
				ethers.utils.parseEther(invoiceAmount)
			);
			console.log("Mining...", txn.hash);
			await txn.wait();
			console.log("Mined");
			// setSellerPAN("");
			// setInvoiceAmount("");
			navigateTo("/")
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingMessage("");
		}
	};

	const validatePAN = (pan) => {
		// check if pan is valid
		// pan should be 10 characters long
		if (pan.length !== 10) {
			return false;
		}
        // PAN format [AAAAA1111A]
		// first 5 characters should be alphabets
		// next 4 characters should be numbers
		// last character should be alphabet
		const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
		if (!regex.test(pan)) {
			return false;
		}

        // 4th character can be P, C, H, A, B, G, J, L, F or I
		const validChar8 = "PCAHBGJLFI";
		if (!validChar8.includes(pan[3])) {
			return false;
		}

		// number part can't be 0001
		if (pan.slice(5, 9) === "0001") {
			return false;
		}

		return true;
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
		<div
			className={darkMode ? "mainContainer darkmode" : "mainContainer"}
		>
			<div className="container">
				<Navbar
					account={account}
					setAccount={setAccount}
					darkMode={darkMode}
					setDarkMode={setDarkMode}
				/>

				<div className="content-container">
					<div className="col-md-5 mt-5">
						<div className="card card-body">

							<h3>Create Invoice</h3>
							<form onSubmit={addInvoice}>
								<label className="mt-4">Seller PAN</label>
								<input
									type="text"
									className="form-control mt-1"
									placeholder="Seller PAN"
									name="sellerPAN"
									onChange={(e) => setSellerPAN(e.target.value)}
									value={sellerPAN}
								/>

								<label className="mt-4">Amount in ETH</label>
								<input
									type="number"
									className="form-control mt-1"
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
							{loadingMessage && (
								<div className="loading">{loadingMessage}...</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CreateInvoice;
