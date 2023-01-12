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

  log("Run Witnet Random contract with command:")
  const networkName = network.name == "hardhat" ? "localhost" : network.name
  // log(`yarn hardhat request-witnet-random-number --contract ${witnetRandom.address} --value 1000000000000000000 --network ${networkName}`)
  log(`Execute requestWitnetRandomNumber, readWitnetLatestRandomizingBlock, fetchWitnetRandomNumber, readWitnetRandomNumber methods`);
  jsonData["witnetRandomNumber"] = witnetRandom.address;
  jsonData["network"] = networkName;
  fs.writeFileSync(sourcePath, JSON.stringify(jsonData))
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "witnet-random", "main"]
