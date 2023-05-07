/* eslint-disable no-undef */
task('read-supra-price-feed', 'Calls an Supra Price Feed Contract to read data')
  .addParam('contract', 'The address of the Supra Price Feed contract that you want to call')
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract
    const networkId = network.name

    console.log('Reading data from Supra Price Feed contract ', contractAddr, ' on network ', networkId)
    const SupraPriceFeed = await ethers.getContractFactory('SupraValueFeedExample')

    // Get signer information
    const accounts = await ethers.getSigners()
    const signer = accounts[0]

    // Create connection to Supra Price Feed Contract and call the function
    const supraPriceFeedContract = new ethers.Contract(contractAddr, SupraPriceFeed.interface, signer)
    const result = await supraPriceFeedContract.getPrice();
    console.log('Last price is: ', result)
    
    if (result === 0 && ['hardhat', 'localhost', 'ganache'].indexOf(network.name) === 0) {
      console.log("You'll either need to wait another minute, or fix something!")
    }
    if (['hardhat', 'localhost', 'ganache'].indexOf(network.name) >= 0) {
      console.log("You'll have to manually update the value since you're on a local chain!")
    }
  })

module.exports = {}
