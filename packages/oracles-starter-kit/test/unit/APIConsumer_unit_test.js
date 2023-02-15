const { assert, expect } = require('chai')
const { network, waffle } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')
const { numToBytes32, toBytes32String } = require('@chainlink/test-helpers/dist/src/helpers')
const { deployMockContract, provider } = waffle

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Unit Tests - APIConsumer', async function () {
    let apiConsumer, mockOracle

    beforeEach(async () => {
      const [deployerOfContract] = provider.getWallets()
      // deploy the contract to Mock
      const APIConsumerABI = require('../../artifacts/contracts/APIConsumer.sol/APIConsumer.json')
      apiConsumer = await deployMockContract(deployerOfContract, APIConsumerABI.abi)

      const MockOracleABI = require('../../artifacts/contracts/test/MockOracle.sol/MockOracle.json')
      mockOracle = await deployMockContract(deployerOfContract, MockOracleABI.abi)
    })

    it('Should successfully make an API request', async () => {
      await apiConsumer.mock.requestVolumeData.withArgs('KLAY', 18).returns(toBytes32String('123'))
      const transaction = await apiConsumer.requestVolumeData('KLAY', 18)
      const transactionReceipt = await transaction.wait(1)
      const requestId = transactionReceipt?.events[0]?.topics[1]
      expect(requestId).to.not.be.null
    })

    it('Should successfully make an API request and get a result', async () => {
      const callbackValue = 777
      await apiConsumer.mock.requestVolumeData.returns(toBytes32String('123'))
      await apiConsumer.mock.volume.returns(callbackValue)
      const transaction = await apiConsumer.requestVolumeData('KLAY', 18)
      const transactionReceipt = await transaction.wait(1)
      const requestId = transactionReceipt?.events[0]?.topics[1]

      await mockOracle.mock.fulfillOracleRequest.withArgs(toBytes32String(requestId || '1234'), numToBytes32(callbackValue)).returns(true)
      await mockOracle.fulfillOracleRequest(toBytes32String(requestId || '1234'), numToBytes32(callbackValue))
      const volume = await apiConsumer.volume()
      assert.equal(volume.toString(), callbackValue.toString())
    })

    it('Our event should successfully fire event on callback', async () => {
      const callbackValue = 777
      await apiConsumer.mock.requestVolumeData.withArgs('KLAY', 18).returns(toBytes32String('123'))
      await apiConsumer.mock.volume.returns(callbackValue)
      apiConsumer.once = (a, b) => {
        b()
      }
      await mockOracle.mock.fulfillOracleRequest.withArgs(toBytes32String('1234'), numToBytes32(callbackValue)).returns(true)

      // we setup a promise so we can wait for our callback from the `once` function
      await new Promise(async (resolve, reject) => {
        const transaction = await apiConsumer.requestVolumeData('KLAY', 18)
        const transactionReceipt = await transaction.wait(1)
        const requestId = transactionReceipt?.events[0]?.topics[1]

        await mockOracle.fulfillOracleRequest(requestId || toBytes32String('1234'), numToBytes32(callbackValue))

        // setup listener for our event
        apiConsumer.once('DataFullfilled', async () => {
          console.log('DataFullfilled event fired!')
          const volume = await apiConsumer.volume()
          // assert throws an error if it fails, so we need to wrap
          // it in a try/catch so that the promise returns event
          // if it fails.
          try {
            assert.equal(volume.toString(), callbackValue.toString())
            resolve()
          } catch (e) {
            reject(e)
          }
        })
      })
    })
  })
