const main = async () => {
    const contractFactory = await hre.ethers.getContractFactory("SolidityTest");
    const contract = await contractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await contract.deployed();

    let result = await contract.getOutput();
    console.log("Output:", result);
        
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
