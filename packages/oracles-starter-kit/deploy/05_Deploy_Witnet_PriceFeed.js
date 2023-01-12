const { getNamedAccounts, deployments, network, run } = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")
const { networks } = require("../hardhat.config")
const fs = require("fs");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let priceRouterAddress;
  if (chainId == 31337) {
    witnetRouterMock = await ethers.getContract("MockWitnetRouter")
    priceRouterAddress = witnetRouterMock.address
  } else {
    priceRouterAddress = networkConfig[chainId]["witnetPriceRouter"]
  }
  
  // Price Feed Address, values can be obtained at https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses
  // Default one below is KLAY/USDT contract on Baobab
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const witnetPriceFeed = await deploy("WitnetPriceFeed", {
    from: deployer,
    args: [priceRouterAddress],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  //TODO: implement verify
  // Verify the deployment
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   log("Verifying...")
  //   await verify(WitnetPriceFeed.address, [priceFeedAddress])
  // }

  let sourcePath = "./deployedContracts.json";
  let jsonData = {
    chainLinkPriceFeed: '',
    chainLinkApiData: '',
    chainLinkRandomNumber: '',
    keepersCounter: '',
    witnetPriceFeed: '',
    witnetRandomNumber: '',
    network: ''
  };
  if (fs.existsSync(sourcePath)) {
    jsonData = JSON.parse(fs.readFileSync(sourcePath));
  }

  log("Run Witnet Price Feed contract with command:")
  const networkName = network.name == "hardhat" ? "localhost" : network.name
  // log(`yarn hardhat read-witnet-price-feed --contract ${witnetPriceFeed.address} --network ${networkName}`)
  log(`Execute readWitnetPriceFeed method`);
  jsonData["witnetPriceFeed"] = witnetPriceFeed.address;
  jsonData["network"] = networkName;
  fs.writeFileSync(sourcePath, JSON.stringify(jsonData))
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "witnet-feed", "main"]
