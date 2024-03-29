const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory("EtherInvoice");
  console.log("Deploying contract...");
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(
    "Contract deployed address: ",
    contract.address,
    "in network:",
    hre.network.name
  );
};

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
