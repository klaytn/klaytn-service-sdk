/* eslint-disable no-undef */
task('request-random-number', 'Requests a random number for a Chainlink VRF enabled smart contract')
  .addParam('contract', 'The address of the API Consumer contract that you want to call')
  .addParam('numwords', 'No of random words to be requested')
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract
    const networkId = network.name
    const numWords = parseInt(taskArgs.numwords || '0')
    console.log(
      'Requesting a random number using VRF consumer contract ',
      contractAddr,
      ' on network ',
      networkId
    )
    const RandomNumberConsumerV2 = await ethers.getContractFactory('RandomNumberConsumerV2')

    // Get signer information
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]

    // Create connection to VRF Contract and call the getRandomNumber function
    const vrfConsumerContractV2 = new ethers.Contract(
      contractAddr,
      RandomNumberConsumerV2.interface,
      signer
    )
    const transaction = await vrfConsumerContractV2.requestRandomWords(numWords, { gasLimit: 200000 })
    console.log(
      'Contract ',
      contractAddr,
      ' random number request successfully called.'
    )
    console.log('Transaction Hash: ' + transaction.hash)
  })

module.exports = {}
