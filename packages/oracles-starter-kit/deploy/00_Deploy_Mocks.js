const { network } = require('hardhat')

const BASE_FEE = '100000000000000000'

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  // If we are on a local development network, we need to deploy mocks!
  if (chainId === 31337) {
    log('Local network detected! Deploying mocks...')
    await deploy('WitnetRandomnessMock', {
      from: deployer,
      log: true,
      args: [1, BASE_FEE]
    })
    await deploy('MockWitnetRouter', {
      from: deployer,
      log: true
    })
    log('Mocks Deployed!')
    log('----------------------------------------------------')
    log("You are deploying to a local network, you'll need a local network running to interact")
    log('Please run `yarn hardhat console` to interact with the deployed smart contracts!')
    log('----------------------------------------------------')
  }
}
module.exports.tags = ['all', 'mocks', 'main']