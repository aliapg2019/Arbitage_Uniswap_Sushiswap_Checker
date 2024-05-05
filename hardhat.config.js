/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    hardhat:{
      forking:{
        url: process.env.INFURA_NODE,
        accounts: [process,env.ACCOUNT],
      }
    }
  }
};
