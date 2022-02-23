const { expect } = require('chai');
const { ethers } = require('hardhat');

/**
describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
}); */

const VALUES = {
  twt: 'ekazukiii',
  website: 'https://ekazuki.fr',
  email: 'ekazuki8400@gmail.com',
  desc: "Hey i'm ekazukii"
};

describe('Domains', function () {
  let owner, other, contract;

  it('Should deploy the contract', async function () {
    [owner, other] = await hre.ethers.getSigners();

    const domainContractFactory = await hre.ethers.getContractFactory('Domains');

    contract = await domainContractFactory.deploy('hodl');
    await contract.deployed();
  });

  it('Should create a domain with default image and without record', async function () {
    const deployment = await contract.register('a16z', {
      value: hre.ethers.utils.parseEther('1234')
    });
    await deployment.wait();

    const address = await contract.getAddress('a16z');
    expect(address).to.equal(owner.address);

    const json = await contract.tokenURI(1);
    expect(json.startsWith('data:application/json;base64')).to.be.true;
  });

  it('Should edit the records of his own domain', async function () {
    const tx1 = await contract.setRecord('a16z', VALUES.twt, 1);
    const tx2 = await contract.setRecord('a16z', VALUES.website, 2);
    const tx3 = await contract.setRecord('a16z', VALUES.email, 3);
    const tx4 = await contract.setRecord('a16z', VALUES.desc, 4);

    await Promise.all([tx1.wait(), tx2.wait(), tx3.wait(), tx4.wait()]);

    const res1 = contract.getRecord('a16z', 1);
    const res2 = contract.getRecord('a16z', 2);
    const res3 = contract.getRecord('a16z', 3);
    const res4 = contract.getRecord('a16z', 4);

    const [twt, site, email, desc] = await Promise.all([res1, res2, res3, res4]);

    expect(twt).to.eq(VALUES.twt);
    expect(site).to.eq(VALUES.website);
    expect(email).to.eq(VALUES.email);
    expect(desc).to.eq(VALUES.desc);
  });

  it("Should not be able to edit the records of other user's domain", async function () {
    const txn = contract.connect(other).setRecord('a16z', 'hackertag', 1);
    await expect(txn).to.be.reverted;

    const twt = await contract.getRecord('a16z', 1);
    expect(twt).to.eq('ekazukiii');
  });

  it('Should return metadata of the NFT', async function () {
    const res = await contract.tokenURI(1);
    const parts = res.split(',');
    const b64 = Buffer.from(parts[1], 'base64');
    const json = JSON.parse(b64.toString('utf8'));

    expect(json.name).to.eq('a16z.hodl');
    expect(json.description).to.eq('A domain on the HODL name service');
    expect(json.image.startsWith('data:image/svg+xml;base64')).to.be.true;
    expect(json.length).to.eq('9');
  });

  it('Should change the avatar record', async function () {
    const tx = await contract.connect(owner).setRecord('a16z', 'https://via.placeholder.com/150', 0);
    await tx.wait();

    const res = await contract.tokenURI(1);
    const parts = res.split(',');
    const b64 = Buffer.from(parts[1], 'base64');
    const json = JSON.parse(b64.toString('utf8'));
    expect(json.image).to.eq('https://via.placeholder.com/150');
  });

  it('Should return all domains of the contract', async function () {
    const tx = await contract.register('a16z2', {
      value: hre.ethers.utils.parseEther('1')
    });
    await tx.wait();

    const res = await contract.getAllNames();
    expect(res).to.eql(['a16z', 'a16z2']);
  });

  it("Should withdraw contract fund only if it's owner", async function () {
    //
  });

  it('Should revert the transaction if register already existing name', async function () {
    const tx = contract.register('a16z', { value: hre.ethers.utils.parseEther('1') });
    await expect(tx).to.be.reverted;
  });

  it('Should revert the transaction if register with not enough matic', async function () {
    const tx = contract.register('a16z3', { value: hre.ethers.utils.parseEther('0.0001') });
    await expect(tx).to.be.reverted;
  });

  it('Should return the right price for each name', async function () {
    const price3C = await contract.price('3ca');
    expect(price3C).to.eq(hre.ethers.utils.parseEther('0.5'));

    const price4C = await contract.price('4car');
    expect(price4C).to.eq(hre.ethers.utils.parseEther('0.3'));

    const price = await contract.price('morecar');
    expect(price).to.eq(hre.ethers.utils.parseEther('0.1'));
  });

  it('Should check if string is valid', async function () {
    const invalidShort = await contract.valid('12');
    expect(invalidShort).to.be.false;

    const invalidLong = await contract.valid('reallytoolongname');
    expect(invalidLong).to.be.false;

    const validEmojis = await contract.valid('💎GEM💎');
    expect(validEmojis).to.be.true;
  });
});
