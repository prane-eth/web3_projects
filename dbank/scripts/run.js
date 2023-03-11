const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory("DBank");
	const contract = await contractFactory.deploy();
	await contract.deployed();

    const [owner, addr1] = await hre.ethers.getSigners();

    const walletBalance = async (address) => {
        var balance = await address.getBalance();
        console.log("Wallet balance: ", hre.ethers.utils.formatEther(balance));
    }
    const accountBalance = async (address) => {
        var balance = await contract.connect(address).getBalance();
        console.log("Account Balance: ", hre.ethers.utils.formatEther(balance));
    }

    // createAccount
    var tx = await contract.createAccount();
    await tx.wait();

    // userHasAccount
    console.log("User has account: ", await contract.userHasAccount());
    console.log("Account created \n");

    // getBalance
    await walletBalance(owner);

    // deposit
    tx = await contract.deposit({ value: hre.ethers.utils.parseEther("1") });
    await tx.wait();
    await walletBalance(owner);
    console.log("Account Balance: ", hre.ethers.utils.formatEther(await contract.getBalance()));
    console.log("Ether deposited \n");

    // withdraw
    tx = await contract.withdraw(hre.ethers.utils.parseEther("0.5"));
    await tx.wait();
    await walletBalance(owner);
    console.log("Ether withdrawn \n");

    // transferToAccount
    await contract.connect(addr1).createAccount();
    await accountBalance(addr1);
    tx = await contract.transferToAccount(addr1.address, hre.ethers.utils.parseEther("0.3"));
    await tx.wait();
    await accountBalance(addr1);
    console.log("Ether transferred to another account \n");

    // transferToWallet
    await walletBalance(addr1);
    tx = await contract.transferToWallet(addr1.address, hre.ethers.utils.parseEther("0.2"));
    await tx.wait();
    await walletBalance(addr1);
    console.log("Ether transferred to another wallet \n");

    // payToAccount
    await accountBalance(addr1);
    tx = await contract.payToAccount(addr1.address, { value: hre.ethers.utils.parseEther("0.5") });
    await tx.wait();
    await accountBalance(addr1);
    console.log("Ether paid to another account \n");

    // payToWallet
    await walletBalance(addr1);
    tx = await contract.payToWallet(addr1.address, { value: hre.ethers.utils.parseEther("0.5") });
    await tx.wait();
    await walletBalance(addr1);
    console.log("Ether paid to another wallet \n");

    await walletBalance(owner);
    tx = await contract.closeAccount();
    await tx.wait();
    await walletBalance(owner);
    console.log("Ether refunded after closing account \n");

    await walletBalance(owner);
    await accountBalance(addr1);
    await walletBalance(addr1);
    console.log("No Ether is lost \n");

    // try to withdraw after account is closed
    try {
        tx = await contract.withdraw(hre.ethers.utils.parseEther("0.5"));
        await tx.wait();
    } catch (error) {
        const errorText = error.message.split("'")[1];
        console.log("Withdraw after account closed: Error:", errorText);
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
