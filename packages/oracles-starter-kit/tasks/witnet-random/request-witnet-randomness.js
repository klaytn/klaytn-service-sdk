/* eslint-disable no-undef */
task('request-witnet-randomness', 'Requests a random number for a Witnet enabled smart contract')
  .addParam('contract', 'The address of the Witnet Random contract that you want to call')
  .addParam('value', 'The value')
  .setAction(async (taskArgs) => {
    const { contract: contractAddr, value } = taskArgs
    const networkId = network.name
    console.log(
      'Requesting a random number using Witnet Random contract ',
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
    const transaction = await witnetRandomContract.requestRandomness({ value, gasLimit: 3000000 })
    console.log(
      'Contract ',
      contractAddr,
      ' random number request successfully called.'
    )
    console.log('Transaction Hash: ' + transaction.hash)
    console.log('Run the following to fetch the random number:')
    console.log(
      'yarn hardhat fetch-witnet-random-number --contract <deployedContractAddress> --network baobab'
    )
    console.warn('Calling fetch-witnet-random-number right after request-wietnet-randomness will most likely cause the transaction to revert. Please allow 5-10 minutes for the randomization request to complete.')
  })

module.exports = {}
