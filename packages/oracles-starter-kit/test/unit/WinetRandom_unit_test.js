const { assert } = require('chai')
const { network, ethers } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('WitnetRandom Unit Tests', async function () {
    let witnetRandomContract

    beforeEach(async () => {
      await deployments.fixture(['mocks', 'witnet-random'])
      witnetRandomContract = await ethers.getContract('WitnetRandom')
    })

    it('Should successfully request a random number', async () => {
      await witnetRandomContract.mock.requestRandomness.withArgs({ value: '1000000000000000000' }).returns()
      await witnetRandomContract.mock.latestRandomizingBlock.returns(123)

      await witnetRandomContract.requestRandomness({ value: '1000000000000000000' })

      const latestRandomizingBlock = await witnetRandomContract.latestRandomizingBlock()

      assert(
        latestRandomizingBlock.gt(ethers.constants.Zero),
        'The latest randomizing block is greater than zero'
      )
    })

    it('Should successfully fetch a random number', async () => {
      await witnetRandomContract.mock.requestRandomness.withArgs({ value: '1000000000000000000' }).returns()
      await witnetRandomContract.mock.fetchRandomNumber.returns()
      await witnetRandomContract.mock.randomness.returns(123)

      await witnetRandomContract.requestRandomness({ value: '1000000000000000000' })

      await witnetRandomContract.fetchRandomNumber()

      const randomNumber = await witnetRandomContract.randomness()

      assert.typeOf(randomNumber, 'number')
      assert.isAtLeast(randomNumber, 0, 'random number is greater than or equal zero')
    })
  })
