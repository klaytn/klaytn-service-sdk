const { assert, expect } = require("chai")
const { network, ethers, waffle } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { deployMockContract, provider } = waffle;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Unit Tests - Keepers Counter", async function () {
      let counter;
      beforeEach(async () => {
        const [deployerOfContract] = provider.getWallets();
        // deploy the contract to Mock
        const KeepersCounterABI = require('../../artifacts/contracts/KeepersCounter.sol/KeepersCounter.json');
        counter = await deployMockContract(deployerOfContract, KeepersCounterABI.abi);
      })

      it("should be able to call checkUpkeep", async () => {
        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""));
        await counter.mock.checkUpkeep.withArgs(checkData).returns(false, ethers.utils.toUtf8Bytes(""));
        const { upkeepNeeded } = await counter.callStatic.checkUpkeep(checkData)
        assert.equal(upkeepNeeded, false)
      })

      it("should not be able to call perform upkeep without the time passed interval", async () => {
        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
        await counter.mock.performUpkeep.withArgs(checkData).revertsWithReason("Time interval not met");
        await expect(counter.performUpkeep(checkData)).to.be.revertedWith("Time interval not met")
      })

      it("should be able to call performUpkeep after time passes", async () => {
        await counter.mock.counter.returns(1);
        const startingCount = await counter.counter()
        const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
        await counter.mock.interval.returns(0);
        const interval = await counter.interval()
        await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
        await network.provider.send("evm_mine");
        await counter.mock.performUpkeep.withArgs(checkData).returns();
        await counter.performUpkeep(checkData)
        await counter.mock.counter.returns(2);
        assert.equal(parseInt(startingCount) + 1, (await counter.counter()).toNumber())
      })
    })
