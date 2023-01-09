const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory("Debank");
	const contract = await contractFactory.deploy();
	await contract.deployed();

    const [owner, addr1] = await hre.ethers.getSigners();

    const walletBalance = async () => {
        var balance = await owner.getBalance();
        console.log("Wallet balance: ", hre.ethers.utils.formatEther(balance));
    }
    const walletBalance1 = async () => {
        var balance = await addr1.getBalance();
        console.log("Wallet Balance of addr1: ", hre.ethers.utils.formatEther(balance));
    }
    const accountBalance = async () => {
        var balance = await contract.getBalance();
        console.log("Account Balance: ", hre.ethers.utils.formatEther(balance));
    }
    const accountBalance1 = async () => {
        var balance = await contract.connect(addr1).getBalance();
        console.log("Account Balance of addr1: ", hre.ethers.utils.formatEther(balance));
    }

      

    // createAccount
    var tx = await contract.createAccount();
    await tx.wait();

    // userHasAccount
    console.log("User has account: ", await contract.userHasAccount());
    console.log("Account created \n");

    // getBalance
    await walletBalance();

    // deposit
    tx = await contract.deposit({ value: hre.ethers.utils.parseEther("1") });
    await tx.wait();
    await walletBalance();
    console.log("Account Balance: ", hre.ethers.utils.formatEther(await contract.getBalance()));
    console.log("Money deposited \n");

    // withdraw
    tx = await contract.withdraw(hre.ethers.utils.parseEther("0.5"));
    await tx.wait();
    await walletBalance();
    console.log("Money withdrawn \n");

    // transferToAccount
    await contract.connect(addr1).createAccount();
    tx = await contract.transferToAccount(addr1.address, hre.ethers.utils.parseEther("0.5"));
    await tx.wait();
    balance = await contract.connect(addr1).getBalance();
    console.log("Account Balance of addr1: ", hre.ethers.utils.formatEther(balance));
    console.log("Money transferred to another account \n");

    // payToAccount
    await accountBalance1();
    tx = await contract.payToAccount(addr1.address, { value: hre.ethers.utils.parseEther("0.5") });
    await tx.wait();
    await accountBalance1();
    console.log("Money paid to another account \n");

    // payToWallet
    await walletBalance1();
    tx = await contract.payToWallet(addr1.address, { value: hre.ethers.utils.parseEther("0.5") });
    await tx.wait();
    await walletBalance1();
    console.log("Money paid to another wallet \n");

    tx = await contract.closeAccount();
    await tx.wait();
    console.log("Money refunded after closing account \n");

    await walletBalance();
    await accountBalance1();
    await walletBalance1();
    console.log("No money is lost \n");

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
