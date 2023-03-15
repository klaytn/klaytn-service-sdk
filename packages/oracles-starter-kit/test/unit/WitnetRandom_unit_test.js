const { assert } = require('chai')
const { network, ethers, waffle } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')
const { deployMockContract, provider } = waffle

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Unit Tests - WitnetRandom', async function () {
    let witnetRandomContract

    beforeEach(async () => {
      const [deployerOfContract] = provider.getWallets()
      // deploy the contract to Mock
      const WitnetRandomABI = require('../../artifacts/contracts/WitnetRandom.sol/WitnetRandom.json')
      witnetRandomContract = await deployMockContract(deployerOfContract, WitnetRandomABI.abi)
    })

    it('Should successfully request a random number', async () => {
      await witnetRandomContract.mock.requestRandomness.returns()
      await witnetRandomContract.mock.latestRandomizingBlock.returns(123)

      await witnetRandomContract.requestRandomness()

      const latestRandomizingBlock = await witnetRandomContract.latestRandomizingBlock()

      assert(
        latestRandomizingBlock.gt(ethers.constants.Zero),
        'The latest randomizing block is greater than zero'
      )
    })

    it('Should successfully fetch a random number', async () => {
      await witnetRandomContract.mock.requestRandomness.returns()
      await witnetRandomContract.mock.fetchRandomNumber.returns()
      await witnetRandomContract.mock.randomness.returns(123)

      await witnetRandomContract.requestRandomness()

      await witnetRandomContract.fetchRandomNumber()

      const randomNumber = await witnetRandomContract.randomness()

      assert.typeOf(randomNumber, 'number')
      assert.isAtLeast(randomNumber, 0, 'random number is greater than or equal zero')
    })
  })