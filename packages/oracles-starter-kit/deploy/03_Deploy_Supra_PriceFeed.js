const { network, ethers } = require('hardhat')
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS
} = require('../helper-hardhat-config')
const fs = require('fs')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const supraValueFeedExample = await deploy('SupraValueFeedExample', {
    from: deployer,
    log: true,
    waitConfirmations: waitBlockConfirmations
  })

  console.log("SupraValueFeedExample address: ", supraValueFeedExample.address);

  const sourcePath = './deployedContracts.json'
  let jsonData = {
    supraPriceFeed: '',
  }
  if (fs.existsSync(sourcePath)) {
    jsonData = JSON.parse(fs.readFileSync(sourcePath))
  }

  jsonData.supraPriceFeed = supraValueFeedExample.address
  fs.writeFileSync(sourcePath, JSON.stringify(jsonData))
  log('----------------------------------------------------')
}

module.exports.tags = ['all', 'main']
