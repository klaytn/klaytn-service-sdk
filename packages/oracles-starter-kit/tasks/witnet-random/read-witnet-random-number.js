/* eslint-disable no-undef */
task('read-witnet-random-number', 'Reads the random number returned to a contract by Witnet Random')
  .addParam('contract', 'The address of the Witnet Random contract that you want to read')
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract
    const networkId = network.name
    console.log('Reading data from Witnet Random contract ', contractAddr, ' on network ', networkId)
    const WitnetRandom = await ethers.getContractFactory('WitnetRandom')

    // Get signer information
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]

    // Create connection to API Consumer Contract and call the createRequestTo function
    const witnetRandomContract = new ethers.Contract(
      contractAddr,
      WitnetRandom.interface,
      signer
    )

    const randomNumber = await witnetRandomContract.randomness()
    console.log(
      `Random Number is: ${randomNumber.toString()}`
    )
  })

module.exports = {}
