const { getNamedAccounts, deployments, network } = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")
const fs = require("fs");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  const keepersUpdateInterval = networkConfig[chainId]["keepersUpdateInterval"] || "30"
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS
  const args = [keepersUpdateInterval]
  const keepersCounter = await deploy("KeepersCounter", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })
  //TODO: implement verify
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   log("Verifying...")
  //   await verify(keepersCounter.address, args)
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
  log(
    "Head to https://keepers.chain.link/ to register your contract for upkeeps. Then run the following command to track the counter updates: "
  )
  const networkName = network.name == "hardhat" ? "localhost" : network.name
  // log(
  //   `yarn hardhat read-keepers-counter --contract ${keepersCounter.address} --network ${networkName}`
  // )
  log(`Execute readChainLinkKeepersCounter method`);
  jsonData["keepersCounter"] = keepersCounter.address;
  jsonData["network"] = networkName;
  fs.writeFileSync(sourcePath, JSON.stringify(jsonData))
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "keepers"]
