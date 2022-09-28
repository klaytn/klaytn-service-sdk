const networkConfig = {
  default: {
    name: "hardhat",
    fee: "100000000000000000",
    keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
    fundAmount: "1000000000000000000",
    keepersUpdateInterval: "30",
  },
  31337: {
    name: "localhost",
    fee: "100000000000000000",
    keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
    fundAmount: "1000000000000000000",
    keepersUpdateInterval: "30",
    ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  },
  1001: {
    name: "baobab",
    linkToken: "0x04c5046A1f4E3fFf094c26dFCAA75eF293932f18",
    keyHash: "0x9be50e2346ee6abe000e6d3a34245e1d232c669703efc44660a413854427027c",
    linkKlayPriceFeed: "0xf49f81b3d2F2a79b706621FA2D5934136352140c", // LINK / KLAY	
    oracle: "0xfC3BdAbD8a6A73B40010350E2a61716a21c87610",
    jobId: "ca98366cc7314957b8c012c72f05aeeb",
    vrfCoordinator: "0x771143FcB645128b07E41D79D82BE707ad8bDa1C",
    witnetPriceRouter: "0xeD074DA2A76FD2Ca90C1508930b4FB4420e413B0",
    witnetRandomness: "0xb4b2e2e00e9d6e5490d55623e4f403ec84c6d33f",
    fee: "100000000000000",
    fundAmount: "100000000000000",
  }
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
}
