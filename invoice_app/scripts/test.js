const main = async () => {

    const contractFactory = await hre.ethers.getContractFactory("Invoice");
	const contract = await contractFactory.deploy();
	await contract.deployed();
	
	// Add Invoice
	const buyerPAN = "1234567890";
	const invoiceAmount = hre.ethers.utils.parseEther("0.1");
	let result = await contract.addInvoice(buyerPAN, "0987654321", invoiceAmount);
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
