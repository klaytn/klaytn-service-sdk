const { assert, expect } = require("chai")
const { network, ethers, waffle } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { deployMockContract, provider } = waffle;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Unit Tests - PriceConsumer", async function () {
      // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
      let priceConsumerV3, mockV3Aggregator

      beforeEach(async () => {
        const [deployerOfContract] = provider.getWallets();
        // deploy the contract to Mock
        const PriceConsumerV3ABI = require('../../artifacts/contracts/PriceConsumerV3.sol/PriceConsumerV3.json');
        priceConsumerV3 = await deployMockContract(deployerOfContract, PriceConsumerV3ABI.abi);

        const MockV3AggregatorABI = require('../../artifacts/@chainlink/contracts/src/v0.6/tests/MockV3Aggregator.sol/MockV3Aggregator.json');
        mockV3Aggregator = await deployMockContract(deployerOfContract, MockV3AggregatorABI.abi);
      })

      describe("constructor", () => {
        it("sets the aggregator addresses correctly", async () => {
          await priceConsumerV3.mock.getPriceFeed.returns(mockV3Aggregator.address)
          const response = await priceConsumerV3.getPriceFeed()
          assert.equal(response, mockV3Aggregator.address)
        })
      })

      describe("getLatestPrice", () => {
        it("should return the same value as the mock", async () => {
          await priceConsumerV3.mock.getLatestPrice.returns(123);
          await mockV3Aggregator.mock.latestRoundData.returns(1, 123, 1, 1, 1);
          const priceConsumerResult = await priceConsumerV3.getLatestPrice()
          const priceFeedResult = (await mockV3Aggregator.latestRoundData()).answer
          assert.equal(priceConsumerResult.toString(), priceFeedResult.toString())
        })
      })
    })