const { assert } = require('chai')
const { network, waffle } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')
const { deployMockContract, provider } = waffle

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Unit Tests - WitnetPriceFeed', async function () {
    // Price Feed Address, values can be obtained at https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses/klaytn-price-feeds
    let witnetPriceFeed

    this.beforeEach(async () => {
      const [deployerOfContract] = provider.getWallets()
      // deploy the contract to Mock
      const WitnetPriceFeedABI = require('../../artifacts/contracts/WitnetPriceFeed.sol/WitnetPriceFeed.json')
      witnetPriceFeed = await deployMockContract(deployerOfContract, WitnetPriceFeedABI.abi)
    })

    describe('getKlayUsdPrice', () => {
      it('should return the same value as the mock', async () => {
        await witnetPriceFeed.mock.getKlayUsdPrice.returns(10, 10)
        const priceConsumerResult = (await witnetPriceFeed.getKlayUsdPrice()).toString()
        console.log(priceConsumerResult)
        assert.equal(priceConsumerResult.toString(), '10,10')
      })
    })
  })
