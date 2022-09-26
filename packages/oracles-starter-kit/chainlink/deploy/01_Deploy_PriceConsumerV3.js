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

  let priceFeedAddress
  if (chainId == 31337) {
    const EthUsdAggregator = await deployments.get("MockV3Aggregator")
    priceFeedAddress = EthUsdAggregator.address
  } else if (chainId === networks.baobab.chainId) {
    priceFeedAddress = networkConfig[chainId]["linkKlayPriceFeed"]
  } else {
    priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one below is ETH/USD contract on Goerli
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS
  log("----------------------------------------------------")
  const priceConsumerV3 = await deploy("PriceConsumerV3", {
    from: deployer,
    args: [priceFeedAddress],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  //TODO: implement verify
  // Verify the deployment
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   log("Verifying...")
  //   await verify(priceConsumerV3.address, [priceFeedAddress])
  // }

  log("Run Price Feed contract with command:")
  const networkName = network.name == "hardhat" ? "localhost" : network.name
  log(`yarn hardhat read-price-feed --contract ${priceConsumerV3.address} --network ${networkName}`)
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "feed", "main"]
