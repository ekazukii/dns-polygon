require('@nomiclabs/hardhat-waffle');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.10',
  networks: {
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/iy2Py0NX46ZqzbySWrBJ2Ew7sPz2s8Vf',
      accounts: [process.env.KEY]
    }
  }
};
