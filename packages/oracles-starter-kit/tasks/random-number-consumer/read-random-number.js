/* eslint-disable no-undef */
task('read-random-number', 'Reads the random number returned to a contract by Chainlink VRF')
  .addParam('contract', 'The address of the VRF contract that you want to read')
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract
    const networkId = network.name
    console.log('Reading data from VRF contract ', contractAddr, ' on network ', networkId)
    const RandomNumberConsumerV2 = await ethers.getContractFactory('RandomNumberConsumerV2')

    // Get signer information
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]

    // Create connection to API Consumer Contract and call the createRequestTo function
    const vrfConsumerContractV2 = new ethers.Contract(
      contractAddr,
      RandomNumberConsumerV2.interface,
      signer
    )

    try {
      let randomWordsCount = (await vrfConsumerContractV2.getRandomWordsCount()).toNumber();
      let randomWords = [];
      for(let i=0; i< randomWordsCount; i++) {
        randomWords.push(await vrfConsumerContractV2.s_randomWords(i));
      }
      console.log(
        `Random Numbers are: ${randomWords.join(",")}`
      )
    } catch (error) {
      if (['hardhat', 'localhost', 'ganache'].includes(network.name)) {
        console.log("You'll have to manually update the value since you're on a local chain!")
      } else {
        console.log(
          `Visit https://vrf.chain.link/klaytn-testnet/${process.env.VRF_SUBSCRIPTION_ID} and make sure that your last request fulfillment is there`
        )
      }
    }
  })

module.exports = {}
