/* eslint-disable no-undef */
task('change-price-feed', 'Change Chainlink Price Feed Address')
  .addParam('contract', 'The address of the Price Feed consumer contract that you want to read')
  .addParam('pricefeedaddress', 'Pricefeed address(https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses/klaytn-price-feeds)')
  .setAction(async (taskArgs) => {
    const contractAddr = taskArgs.contract
    const networkId = network.name
    const pricefeedaddress = taskArgs.pricefeedaddress

    const PriceFeedConsumerContract = await ethers.getContractFactory('PriceConsumerV3')
    console.log(
      'Change Price Feed address ',
      contractAddr,
      ' on network ',
      networkId
    )

    // Get signer information
    const accounts = await ethers.getSigners()
    const signer = accounts[0]
    const priceFeedConsumerContract = await new ethers.Contract(
      contractAddr,
      PriceFeedConsumerContract.interface,
      signer
    )
    const transaction = await priceFeedConsumerContract.changePriceFeed(pricefeedaddress, { gasLimit: 200000 })
    console.log(
      'Contract ',
      contractAddr,
      ' random number request successfully called.'
    )
    console.log('Transaction Hash: ' + transaction.hash)
  })

module.exports = {}
