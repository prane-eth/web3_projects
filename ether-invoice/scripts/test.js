const main = async () => {

    const contractFactory = await hre.ethers.getContractFactory("Invoice");
	const contract = await contractFactory.deploy();
	await contract.deployed();
	
	// Add Invoice
	const buyerPAN = "BAJPC4350M";
	const invoiceAmount = hre.ethers.utils.parseEther("0.01");
	let result = await contract.addInvoice(buyerPAN, "DAJPC4150P", invoiceAmount);
	await result.wait();
	console.log("Invoice added");

	// Get Invoice
    result = await contract.getInvoicesByPAN(buyerPAN);
	console.log(result);
	console.log("Invoice fetched");

	// Pay Invoice
	const invoiceToPay = result[0];
	result = await contract.payInvoiceByPAN(invoiceToPay.buyerPAN, 0, {
		value: invoiceToPay.invoiceAmount,
	});
	console.log("Invoice paid");

	// Get Invoice
	result = await contract.getInvoicesByPAN(buyerPAN);
	console.log(result);
	console.log("Invoice fetched");

	// validate various PANs
	const validPANs = ["BAJPC4350M", "DAJPC4150P", "FAJPC4150P", "GAJPC4150P"];
	const invalidPANs = ["BAJPC4350", "1AJPC4150P", "FAJPC4150P1", "FAJPC0000P1", "GAJZC4150P"];
	console.log("\nTesting valid PANs");
	for (let pan of validPANs) {
		result = await contract.validatePAN(pan);
		console.log(`${pan}: ${result}`);
	}
	console.log("\nTesting invalid PANs");
	for (let pan of invalidPANs) {
		result = await contract.validatePAN(pan);
		console.log(`${pan}: ${result}`);
	}

	// add invoice with invalid PAN
	console.log("\naddInvoice with invalid PAN");
	try {
		result = await contract.addInvoice(invalidPANs[0], invalidPANs[1], invoiceAmount);
		await result.wait();
	} catch (error) {
		console.log("Failed with error: " + error.message);
	}

	// add invoice with 0 amount
	console.log("addInvoice with 0 amount");
	try {
		result = await contract.addInvoice("BAJPC4350M", "DAJPC4150P", 0);
		await result.wait();
	} catch (error) {
		console.log("Failed with error: " + error.message);
	}

}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();
