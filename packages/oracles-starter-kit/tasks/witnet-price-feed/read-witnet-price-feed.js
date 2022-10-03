task("read-witnet-price-feed", "Calls an Witnet Price Feed Contract to read data")
  .addParam("contract", "The address of the Witnet Price Feed contract that you want to call")
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract
    const networkId = network.name
    console.log("Reading data from Witnet Price Feed contract ", contractAddr, " on network ", networkId)
    const WitnetPriceFeed = await ethers.getContractFactory("WitnetPriceFeed")

    //Get signer information
    const accounts = await ethers.getSigners()
    const signer = accounts[0]

    //Create connection to Witnet Price Feed Contract and call the createRequestTo function
    const witnetPriceFeedContract = new ethers.Contract(contractAddr, WitnetPriceFeed.interface, signer)
    let result = (await witnetPriceFeedContract.getKlayUsdPrice())
    console.log("Last price is: ", result[0].toString())
    console.log("Last timestamp is: ", result[1].toString())
    if (result == 0 && ["hardhat", "localhost", "ganache"].indexOf(network.name) == 0) {
      console.log("You'll either need to wait another minute, or fix something!")
    }
    if (["hardhat", "localhost", "ganache"].indexOf(network.name) >= 0) {
      console.log("You'll have to manually update the value since you're on a local chain!")
    }
  })

module.exports = {}
