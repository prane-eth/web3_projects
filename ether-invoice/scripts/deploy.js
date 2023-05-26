const main = async () => {
  const myContractFactory = await hre.ethers.getContractFactory(
      "EtherInvoice"
  );
  const myContract = await myContractFactory.deploy();

  await myContract.deployed();

  console.log("Contract deployed address: ", myContract.address);
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
