const { assert } = require('chai')
const { network, ethers, waffle } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')
const { deployMockContract, provider } = waffle

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Unit Tests - RandomNumberConsumer', async function () {
    let randomNumberConsumerV2, vrfCoordinatorV2Mock

    beforeEach(async () => {
      const [deployerOfContract] = provider.getWallets()
      // deploy the contract to Mock
      const VrfCoordinatorV2MockABI = require('../../artifacts/@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol/VRFCoordinatorV2Mock.json')
      vrfCoordinatorV2Mock = await deployMockContract(deployerOfContract, VrfCoordinatorV2MockABI.abi)

      const RandomNumberConsumerV2ABI = require('../../artifacts/contracts/RandomNumberConsumerV2.sol/RandomNumberConsumerV2.json')
      randomNumberConsumerV2 = await deployMockContract(deployerOfContract, RandomNumberConsumerV2ABI.abi)
    })

    it('Should successfully request a random number and get a result', async () => {
      await randomNumberConsumerV2.mock.requestRandomWords.withArgs(2).returns()
      await randomNumberConsumerV2.mock.s_requestId.returns(123)
      await randomNumberConsumerV2.mock.s_randomWords.returns([1, 1])
      await vrfCoordinatorV2Mock.mock.fulfillRandomWords.withArgs(123, randomNumberConsumerV2.address).returns()

      await randomNumberConsumerV2.requestRandomWords(2)
      const requestId = await randomNumberConsumerV2.s_requestId()

      await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomNumberConsumerV2.address)
      const firstRandomNumber = await randomNumberConsumerV2.s_randomWords(0)
      const secondRandomNumber = await randomNumberConsumerV2.s_randomWords(1)

      assert(
        firstRandomNumber.gt(ethers.constants.Zero),
        'First random number is greather than zero'
      )

      assert(
        secondRandomNumber.gt(ethers.constants.Zero),
        'Second random number is greather than zero'
      )
    })

    it('Should successfully fire event on callback', async function () {
      randomNumberConsumerV2.once = (a, b) => {
        b()
      }
      await randomNumberConsumerV2.mock.s_randomWords.returns([1, 1])
      await randomNumberConsumerV2.mock.requestRandomWords.withArgs(2).returns()
      await randomNumberConsumerV2.mock.s_requestId.returns(123)

      await randomNumberConsumerV2.requestRandomWords(2)
      const requestId = await randomNumberConsumerV2.s_requestId()
      vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomNumberConsumerV2.address)

      await new Promise(async (resolve, reject) => {
        randomNumberConsumerV2.once('ReturnedRandomness', async () => {
          console.log('ReturnedRandomness event fired!')
          const firstRandomNumber = await randomNumberConsumerV2.s_randomWords(0)
          const secondRandomNumber = await randomNumberConsumerV2.s_randomWords(1)
          // assert throws an error if it fails, so we need to wrap
          // it in a try/catch so that the promise returns event
          // if it fails.
          try {
            assert(firstRandomNumber.gt(ethers.constants.Zero))
            assert(secondRandomNumber.gt(ethers.constants.Zero))
            resolve()
          } catch (e) {
            reject(e)
          }
        })
      })
    })
  })
