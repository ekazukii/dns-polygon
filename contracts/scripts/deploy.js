const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy('hodl');
  await domainContract.deployed();

  const reverseContractFactory = await hre.ethers.getContractFactory('ReverseDNS');
  const reverseContract = await reverseContractFactory.deploy(domainContract.address);
  await reverseContract.deployed();

  console.log('Contract deployed to:', domainContract.address);
  console.log('ReverseDNS deployed to:', reverseContract.address);

  let txn = await domainContract.register('ekazuki', {
    value: hre.ethers.utils.parseEther('0.1')
  });
  await txn.wait();
  console.log('Minted domain ekazuki.hodl');

  txn = await domainContract.setRecord('ekazuki', 'Am I ekazuki or a HODLER??');
  await txn.wait();
  console.log('Set record for ekazuki.hodl');

  const address = await domainContract.getAddress('ekazuki');
  console.log('Owner of domain ekazuki:', address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(balance));
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
