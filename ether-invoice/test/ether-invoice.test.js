const { expect } = require("chai");

const deployContract = async (contractName, ...args) => {
	const contract = await ethers
		.getContractFactory(contractName)
		.then((contractFactory) => contractFactory.deploy(...args));
	await contract.deployed();
	return contract;
};

describe("EtherInvoice", function () {
	var contract, user, contractUser;
	const { parseEther } =
		ethers.utils || ethers || hre.ethers.utils || hre.ethers;
	const oneEther = parseEther("1.0");
	const halfEther = parseEther("0.5");
	const buyerPAN = "AAAAA0000A";
	const sellerPAN = "BBBBB1111B";

	it.only("Should deploy without errors", async function () {
		[owner, user] = await ethers.getSigners();
		contract = await deployContract("EtherInvoice");
		contractUser = contract.connect(user);
		expect(await contract.deployed()).to.equal(contract);
	});

	it.only("Should add an invoice", async function () {
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(invoices.length).to.equal(1);
		expect(invoices[0].buyerPAN).to.equal(buyerPAN);
		expect(invoices[0].sellerPAN).to.equal(sellerPAN);
		expect(invoices[0].invoiceAmount.toString()).to.equal(
			oneEther.toString()
		);
		expect(invoices[0].paid).to.equal(false);
	});

	it.only("Should not add an invoice with an invalid PAN", async function () {
		const invalidPAN = "InvalidPAN";
		await expect(
			contractUser.addInvoice(invalidPAN, sellerPAN, 100)
		).to.be.revertedWith("InvoiceApp: Invalid buyer PAN");
	});

	it.only("Should pay an invoice", async function () {
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);
		await contractUser.payInvoiceByPAN(buyerPAN, 0, {
			value: oneEther
		});
		const updatedInvoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(updatedInvoices[0].paid).to.equal(true);
	});

	it.only("Should get invoices by PAN", async function () {
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(invoices.length).to.be.greaterThan(1);
		
		const invoice = invoices[0];
		expect(invoice.buyerPAN).to.equal(buyerPAN);
		expect(invoice.sellerPAN).to.equal(sellerPAN);
		expect(invoice.invoiceAmount.toString()).to.equal(
			oneEther.toString()
		);
		expect(invoice.paid).to.equal(false);
	});

	it.only("Should validate a valid PAN", async function () {
		const isValid = await contract.validatePAN(buyerPAN);
		expect(isValid).to.equal(true);
	});

	it.only("Should not validate an invalid PAN", async function () {
		const invalidPAN = "InvalidPAN";
		const isValid = await contract.validatePAN(invalidPAN);
		expect(isValid).to.equal(false);
	});

	it.only("Should not add an invoice with zero invoice amount", async function () {
		const invoiceAmount = 0;
		await expect(
			contractUser.addInvoice(buyerPAN, sellerPAN, invoiceAmount)
		).to.be.revertedWith(
			"InvoiceApp: Invoice amount should be greater than 0"
		);
	});

	it.only("Should get empty invoice list for non-existent PAN", async function () {
		const nonExistentPAN = "CCCCC2222C";
		const invoices = await contract.getInvoicesByPAN(nonExistentPAN);
		expect(invoices.length).to.equal(0);
	});

	it.only("Should not pay an invoice with incorrect amount", async function () {
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);

		await expect(
			contractUser.payInvoiceByPAN(buyerPAN, 0, {
				value: halfEther,
			})
		).to.be.revertedWith("Amount not matched");

		const updatedInvoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(updatedInvoices[0].paid).to.equal(false);
	});

	it.only("Should not add an invoice with the same buyer and seller PAN", async function () {
		await expect(
			contractUser.addInvoice(buyerPAN, buyerPAN, oneEther)
		).to.be.revertedWith("InvoiceApp: Invalid seller PAN");
	});

	it.only("Should not pay a non-existent invoice", async function () {
		await expect(
			contractUser.payInvoiceByPAN(buyerPAN, 0, {
				value: oneEther
			})
		).to.be.revertedWith(
			"VM Exception while processing transaction: revert"
		);
	});

	it.only("Should return correct invoice count by PAN", async function () {
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(invoices.length).to.equal(2);
	});
});
