const main = async () => {

    const contractFactory = await hre.ethers.getContractFactory("Todo");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log("Contract address:", contract.address);

    const printBalance = async () => {
        console.log("______________________________________");
        let contractBalance = await hre.ethers.provider.getBalance(
            contract.address
        );
        console.log(
            "Contract balance:",
            hre.ethers.utils.formatEther(contractBalance)
        );

        let walletBalance = await hre.ethers.provider.getBalance(
            contract.deployTransaction.from
        );
        console.log(
            "Wallet balance:",
            hre.ethers.utils.formatEther(walletBalance)
        );
        console.log("______________________________________");
    }

    let tasks = await contract.getAllTasks();
    console.log('tasks[0]:', tasks[0]);
    let taskId = tasks[0].id;
    // deposit some ether to the contract
    await contract.deposit(taskId, {value: hre.ethers.utils.parseEther("2.1")});
    console.log("Deposit done");

    // await printBalance();

    tasks = await contract.getAllTasks();
    console.log(hre.ethers.utils.formatEther(tasks[0].balance));

    // finish task
    let finishTxn = await contract.finishTask(taskId);
    await finishTxn.wait();
    console.log("Task finished");

    tasks = await contract.getAllTasks();
    console.log(hre.ethers.utils.formatEther(tasks[0].balance));

    // refund to owner
    // let refundTxn = await contract.refundToOwner();
    // await refundTxn.wait();
    // console.log("Refund done");

    await printBalance();
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
