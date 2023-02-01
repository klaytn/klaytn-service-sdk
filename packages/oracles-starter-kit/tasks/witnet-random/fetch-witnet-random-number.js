/* eslint-disable no-undef */
task('fetch-witnet-random-number', 'Fetch a random number for a Witnet enabled smart contract')
  .addParam('contract', 'The address of the Witnet Random contract that you want to call')
  .setAction(async (taskArgs) => {
    const { contract: contractAddr } = taskArgs
    const networkId = network.name
    console.log(
      'Fetch a random number using Witnet Random contract ',
      contractAddr,
      ' on network ',
      networkId
    )
    const WitnetRandom = await ethers.getContractFactory('WitnetRandom')

    // Get signer information
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]

    // Create connection to VRF Contract and call the getRandomNumber function
    const witnetRandomContract = new ethers.Contract(
      contractAddr,
      WitnetRandom.interface,
      signer
    )
    const transaction = await witnetRandomContract.fetchRandomNumber({ gasLimit: 200000 })
    console.log(
      'Contract ',
      contractAddr,
      ' random number request successfully called.'
    )
    console.log('Transaction Hash: ' + transaction.hash)
    console.log('Run the following to read the returned random number:')
    console.log(
      'await OracleSDK.readWitnetLatestRandomizingBlock() or await OracleSDK.readWitnetRandomNumber()'
    )
  })

module.exports = {}
