const { ethers, upgrades } = require('hardhat');

async function main() {
  const NftCollection = await ethers.getContractFactory("NftCollection");
  const proxy = await upgrades.deployProxy(NftCollection);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxy.address
  );

  console.log('Proxy contract address: ' + proxy.address);
  console.log('Implementation contract address: ' + implementationAddress);
}

main();
