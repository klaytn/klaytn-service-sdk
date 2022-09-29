const { getNamedAccounts, deployments, network, run } = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")
const { networks } = require("../hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let witnetRandomAddress
  
  if (chainId == 31337) {
    WitnetRandomnessMock = await ethers.getContract("WitnetRandomnessMock")
    witnetRandomAddress = WitnetRandomnessMock.address
  } else {
    witnetRandomAddress = networkConfig[chainId]["witnetRandomness"]
  }

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS
  log("----------------------------------------------------")
  const witnetRandom = await deploy("WitnetRandom", {
    from: deployer,
    args: [witnetRandomAddress],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  //TODO: implement verify
  // Verify the deployment
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   log("Verifying...")
  //   await verify(WitnetRandom.address, [witnetRandomAddress])
  // }

  log("Run Witnet Random contract with command:")
  const networkName = network.name == "hardhat" ? "localhost" : network.name
  log(`yarn hardhat request-witnet-random-number --contract ${witnetRandom.address} --value 1000000000000000000 --network ${networkName}`)
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "witnet-random", "main"]
