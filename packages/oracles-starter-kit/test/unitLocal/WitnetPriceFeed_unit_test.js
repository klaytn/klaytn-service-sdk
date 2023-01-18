const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("WitnetPriceFeed Unit Tests", async function () {
        // Price Feed Address, values can be obtained at https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses/klaytn-price-feeds
        let witnetPriceFeed;

        this.beforeEach(async () => {
            await deployments.fixture(["mocks", "witnet-feed"]);
            witnetPriceFeed = await ethers.getContract("WitnetPriceFeed");
        })

        describe("getKlayUsdPrice", () => {
            it("should return the same value as the mock", async () => {
              const priceConsumerResult = (await witnetPriceFeed.getKlayUsdPrice()).toString();
              console.log(priceConsumerResult);
              assert.equal(priceConsumerResult.toString(), "10,10")
            })
          })
    })
