const { expect } = require("chai");

const deployContract = async (contractName, ...args) => {
	const contract = await ethers
		.getContractFactory(contractName)
		.then((contractFactory) => contractFactory.deploy(...args));
	await contract.deployed();
	return contract;
};

const appName = "EtherInvoice";

describe(appName, function () {
	var contract, user, contractUser;
	const { parseEther } =
		ethers.utils || ethers || hre.ethers.utils || hre.ethers;
	const oneEther = parseEther("1.0");
	const buyerPAN = "AAAAA0000A";
	const sellerPAN = "BBBBB1111B";
	const nonExistentPAN = "CCCCC2222C";

	it("Should deploy without errors", async function () {
		[owner, user] = await ethers.getSigners();
		contract = await deployContract(appName);
		contractUser = contract.connect(user);
		expect(await contract.deployed()).to.equal(contract);
	});

	it("Should add an invoice", async function () {
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

	it("Should not add an invoice with an invalid PAN", async function () {
		const invalidPAN = "InvalidPAN";
		await expect(
			contractUser.addInvoice(invalidPAN, sellerPAN, 100)
		).to.be.revertedWith(`${appName}: Invalid buyer PAN`);
	});

	it("Should pay an invoice", async function () {
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);
		await contractUser.payInvoiceByPAN(buyerPAN, 0, {
			value: oneEther
		});
		const updatedInvoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(updatedInvoices[0].paid).to.equal(true);
	});

	it("Should get invoices by PAN", async function () {
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);

		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(invoices.length).to.be.greaterThan(1);
		
		const invoice = invoices[invoices.length - 1];
		expect(invoice.buyerPAN).to.equal(buyerPAN);
		expect(invoice.sellerPAN).to.equal(sellerPAN);
		expect(invoice.invoiceAmount.toString()).to.equal(
			oneEther.toString()
		);
		expect(invoice.paid).to.equal(false);
	});

	it("Should validate a valid PAN", async function () {
		const oldInvoices = await contract.getInvoicesByPAN(buyerPAN);
		const oldLength = oldInvoices.length;
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);
		const newInvoices = await contract.getInvoicesByPAN(buyerPAN);
		const newLength = newInvoices.length;
		expect(newLength).to.equal(oldLength + 1);
	});

	it("Should not validate an invalid PAN", async function () {
		const invalidPAN = "InvalidPAN";
		await expect(
			contractUser.addInvoice(invalidPAN, sellerPAN, 100)
		).to.be.revertedWith(`${appName}: Invalid buyer PAN`);

		await expect(
			contractUser.addInvoice(buyerPAN, invalidPAN, 100)
		).to.be.revertedWith(`${appName}: Invalid seller PAN`);
	});

	it("Should not add an invoice with zero invoice amount", async function () {
		const invoiceAmount = 0;
		await expect(
			contractUser.addInvoice(buyerPAN, sellerPAN, invoiceAmount)
		).to.be.revertedWith(`${appName}: Invoice amount should be greater than 0`);
	});

	it("Should get empty invoice list for non-existent PAN", async function () {
		const invoices = await contract.getInvoicesByPAN(nonExistentPAN);
		expect(invoices.length).to.equal(0);
	});

	it("Should not pay an invoice with incorrect amount", async function () {
		await contractUser.addInvoice(buyerPAN, sellerPAN, oneEther);

		// get invoices length
		const invoices = await contract.getInvoicesByPAN(buyerPAN);
		const lastIndex = invoices.length - 1;
		await expect(
			contractUser.payInvoiceByPAN(buyerPAN, lastIndex, {
				value: parseEther("0.5"),
			})
		).to.be.revertedWith(`${appName}: Amount not matched`);

		const updatedInvoices = await contract.getInvoicesByPAN(buyerPAN);
		expect(updatedInvoices[lastIndex].paid).to.equal(false);
	});

	it("Should not add an invoice with the same buyer and seller PAN", async function () {
		await expect(
			contractUser.addInvoice(buyerPAN, buyerPAN, oneEther)
		).to.be.revertedWith(`${appName}: Buyer and seller PAN can't be same`);
	});

	it("Should not pay a non-existent invoice", async function () {
		await expect(
			contractUser.payInvoiceByPAN(nonExistentPAN, 0, {
				value: oneEther
			})
		).to.be.reverted
	});
});
