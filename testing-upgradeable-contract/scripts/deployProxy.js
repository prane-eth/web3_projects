const { ethers, upgrades } = require('hardhat');

async function main() {
  const VendMachineV1 = await ethers.getContractFactory("VendMachineV1");
  const proxy = await upgrades.deployProxy(VendMachineV1, [100]);
  await proxy.deployed();

  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    proxy.address
  );

  console.log('Proxy contract address: ' + proxy.address);

  console.log('Implementation contract address: ' + implementationAddress);
}

main();