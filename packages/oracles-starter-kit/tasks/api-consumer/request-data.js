/* eslint-disable no-undef */

task('request-data', 'Calls an API Consumer Contract to request external data')
  .addParam('contract', 'The address of the API Consumer contract that you want to call')
  .addParam('coinsymbol', 'coin symbol (valid fsyms) from https://min-api.cryptocompare.com ex: KLAY')
  .addParam('coindecimals', 'coin decimals ex: 18')
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract
    const coinsymbol = taskArgs.coinsymbol || 'KLAY'
    const coindecimals = parseInt(taskArgs.coindecimals || '18')
    console.log('Calling API Consumer contract ', contractAddr, ' on network ', network.name)
    const APIConsumer = await ethers.getContractFactory('APIConsumer')

    // Get signer information
    const accounts = await ethers.getSigners()
    const signer = accounts[0]

    // Create connection to API Consumer Contract and call the createRequestTo function
    const apiConsumerContract = new ethers.Contract(contractAddr, APIConsumer.interface, signer)
    const result = await apiConsumerContract.requestVolumeData(coinsymbol, coindecimals, { gasLimit: 200000 })
    console.log(
      'Contract ',
      contractAddr,
      ' external data request successfully called.  '
    )
    console.log('Transaction Hash: ' + result.hash)
  })
module.exports = {}
