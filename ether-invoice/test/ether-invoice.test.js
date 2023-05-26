const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther, formatEther } = ethers.utils || ethers;

const deployContract = async (contractName, ...args) => {
	const contract = await ethers
		.getContractFactory(contractName)
		.then((contractFactory) => contractFactory.deploy(...args));
	await contract.deployed();
	return contract;
};

describe("EtherInvoice", function () {
	var contract, owner, user;
	const smallAmountString = "0.1";
	const smallAmount = parseEther(smallAmountString);

	it("Should deploy without errors", async function () {
		[owner, user] = await ethers.getSigners();
		contract = await deployContract("EtherInvoice");
		expect(await contract.deployed()).to.equal(contract);
	});

	it("Should add an invoice", async function () {
		const buyerPAN = "AAAAA0000A";
		const sellerPAN = "BBBBB1111B";
		const invoiceAmount = parseEther("1.0");

		await contract
			.connect(user)
			.addInvoice(buyerPAN, sellerPAN, invoiceAmount);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(invoices.length).to.equal(1);
		expect(invoices[0].buyerPAN).to.equal(buyerPAN);
		expect(invoices[0].sellerPAN).to.equal(sellerPAN);
		expect(invoices[0].invoiceAmount.toString()).to.equal(
			invoiceAmount.toString()
		);
		expect(invoices[0].paid).to.equal(false);
	});

	it("Should not add an invoice with an invalid PAN", async function () {
		const invalidPAN = "InvalidPAN";

		await expect(
			contract.connect(user).addInvoice(invalidPAN, "BBBBB1111B", 100)
		).to.be.revertedWith("InvoiceApp: Invalid buyer PAN");
	});

	it("Should pay an invoice", async function () {
		const buyerPAN = "AAAAA0000A";
		const sellerPAN = "BBBBB1111B";
		const invoiceAmount = parseEther("1.0");

		await contract
			.connect(user)
			.addInvoice(buyerPAN, sellerPAN, invoiceAmount);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		const invoiceIndex = 0;

		await expect(
			contract.connect(user).payInvoiceByPAN(buyerPAN, invoiceIndex, {
				value: invoiceAmount,
			})
		).to.emit(contract, "InvoicePaid");

		const updatedInvoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(updatedInvoices[invoiceIndex].paid).to.equal(true);
	});

	it("Should get invoices by PAN", async function () {
		const buyerPAN = "AAAAA0000A";
		const sellerPAN = "BBBBB1111B";
		const invoiceAmount = parseEther("1.0");

		await contract
			.connect(user)
			.addInvoice(buyerPAN, sellerPAN, invoiceAmount);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(invoices.length).to.equal(1);
		expect(invoices[0].buyerPAN).to.equal(buyerPAN);
		expect(invoices[0].sellerPAN).to.equal(sellerPAN);
		expect(invoices[0].invoiceAmount.toString()).to.equal(
			invoiceAmount.toString()
		);
		expect(invoices[0].paid).to.equal(false);
	});

	it("Should validate a valid PAN", async function () {
		const validPAN = "AAAAA0000A";
		const isValid = await contract.validatePAN(validPAN);
		expect(isValid).to.equal(true);
	});

	it("Should not validate an invalid PAN", async function () {
		const invalidPAN = "InvalidPAN";
		const isValid = await contract.validatePAN(invalidPAN);
		expect(isValid).to.equal(false);
	});

	it("Should not add an invoice with zero invoice amount", async function () {
		const buyerPAN = "AAAAA0000A";
		const sellerPAN = "BBBBB1111B";
		const invoiceAmount = 0;

		await expect(
			contract
				.connect(user)
				.addInvoice(buyerPAN, sellerPAN, invoiceAmount)
		).to.be.revertedWith(
			"InvoiceApp: Invoice amount should be greater than 0"
		);
	});

	it("Should get empty invoice list for non-existent PAN", async function () {
		const nonExistentPAN = "CCCCC2222C";
		const invoices = await contract.getInvoicesByPAN(nonExistentPAN);
		expect(invoices.length).to.equal(0);
	});

	it("Should not pay an invoice with incorrect amount", async function () {
		const buyerPAN = "AAAAA0000A";
		const sellerPAN = "BBBBB1111B";
		const invoiceAmount = parseEther("1.0");

		await contract
			.connect(user)
			.addInvoice(buyerPAN, sellerPAN, invoiceAmount);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		const invoiceIndex = 0;

		await expect(
			contract.connect(user).payInvoiceByPAN(buyerPAN, invoiceIndex, {
				value: parseEther("0.5"),
			})
		).to.be.revertedWith("Amount not matched");

		const updatedInvoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(updatedInvoices[invoiceIndex].paid).to.equal(false);
	});

	it("Should not add an invoice with the same buyer and seller PAN", async function () {
		const pan = "AAAAA0000A";
		const invoiceAmount = parseEther("1.0");

		await expect(
			contract.connect(user).addInvoice(pan, pan, invoiceAmount)
		).to.be.revertedWith("InvoiceApp: Invalid seller PAN");
	});

	it("Should not pay a non-existent invoice", async function () {
		const buyerPAN = "AAAAA0000A";
		const invoiceIndex = 0;

		await expect(
			contract
				.connect(user)
				.payInvoiceByPAN(buyerPAN, invoiceIndex, {
					value: parseEther("1.0"),
				})
		).to.be.revertedWith(
			"VM Exception while processing transaction: revert"
		);
	});

	it("Should return correct invoice count by PAN", async function () {
		const buyerPAN = "AAAAA0000A";
		const sellerPAN = "BBBBB1111B";
		const invoiceAmount = parseEther("1.0");

		await contract
			.connect(user)
			.addInvoice(buyerPAN, sellerPAN, invoiceAmount);
		await contract
			.connect(user)
			.addInvoice(buyerPAN, sellerPAN, invoiceAmount);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(invoices.length).to.equal(2);
	});
});
