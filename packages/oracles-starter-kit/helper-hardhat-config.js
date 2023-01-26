const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./helper-hardhat-config.json'))
const networkConfig = config.networkConfig
const developmentChains = config.developmentChains
const VERIFICATION_BLOCK_CONFIRMATIONS = config.VERIFICATION_BLOCK_CONFIRMATIONS

module.exports = {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS
}
