const { exec } = require('node:child_process')
const fs = require('fs-extra')
const path = require('path')

const envfile = require('envfile')
const sourcePath = path.join(__dirname, '.env')
const deployedContractsSourcePath = path.join(__dirname, 'deployedContracts.json')
const hardhatConfigSourcePath = path.join(__dirname, 'helper-hardhat-config.json')
const envSourcePath = path.join(__dirname, '.env.example')

function command (_command) {
  return new Promise((resolve, reject) => {
    exec(_command, (err, output) => {
      // once the command has completed, the callback function is called
      if (err) {
        // log and return if we encounter an error
        console.error('could not execute command: ', err)
        reject(err)
        return
      }
      // log the output received from the command
      resolve(output)
    })
  })
}

/**
 * @param {Object} variableData
 * @param {string} variableData.BAOBAB_RPC_URL - Klaytn testnet RPC URL
 * @param {string} variableData.PRIVATE_KEY - Users private key
 * @param {boolean} variableData.AUTO_FUND
 * @param {number} variableData.VRF_SUBSCRIPTION_ID - Chainlink vrf subscription id
 * @returns {boolean}
 */
function setVariables (variableData) {
  try {
    if (!fs.existsSync(sourcePath)) {
      fs.copyFileSync(envSourcePath, sourcePath)
    }
    const parsedFile = envfile.parse(fs.readFileSync(sourcePath))
    Object.keys(variableData).forEach(key => {
      parsedFile[key] = variableData[key]
    })
    fs.writeFileSync(sourcePath, envfile.stringify(parsedFile))
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

/**
 * @returns {Object} variableData
 * @returns {string} variableData.BAOBAB_RPC_URL - Klaytn testnet RPC URL
 * @returns {string} variableData.PRIVATE_KEY - Users private key
 * @returns {boolean} variableData.AUTO_FUND
 * @returns {number} variableData.VRF_SUBSCRIPTION_ID - Chainlink vrf subscription id
 */
function getVariables () {
  if (!fs.existsSync(sourcePath)) {
    fs.copyFileSync(envSourcePath, sourcePath)
  }
  return envfile.parse(fs.readFileSync(sourcePath))
}

/**
 * @param {Object} config
 */
function setBaobabHardhatConfigurations (config) {
  const jsonData = JSON.parse(fs.readFileSync(hardhatConfigSourcePath))
  jsonData.networkConfig['1001'] = { ...jsonData.networkConfig['1001'], ...config }
  fs.writeFileSync(hardhatConfigSourcePath, JSON.stringify(jsonData))
}

/**
 * @returns {Object} config
 */
function getBaobabHardhatConfigurations () {
  return JSON.parse(fs.readFileSync(hardhatConfigSourcePath)).networkConfig['1001']
}

/**
 * @returns {Promise} compile info
 */
function compile () {
  return command(`cd ${__dirname} && npx hardhat compile`)
}

/**
 * @returns {Promise} deployment info
 */
function deployAll () {
  return command(`cd ${__dirname} && npx hardhat deploy`)
}

/**
 * @returns {Object} deployed contracts
 */
function readDeployedContracts () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('contracts are not deployed')
  }
  return JSON.parse(fs.readFileSync(deployedContractsSourcePath))
}

/**
 * @returns {Promise} deployment info
 */
async function deployChainLinkPriceFeed () {
  await command(`cd ${__dirname} && npx hardhat deploy --tags feed`)
  return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath)).chainLinkPriceFeed }
}

/**
 * @returns {Promise} result
 */
async function readChainLinkPriceFeed () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.chainLinkPriceFeed) {
    throw new Error('ChainLinkPriceFeed contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat read-price-feed --contract ${jsonData.chainLinkPriceFeed} --network ${jsonData.network}`)
  console.log(response)
  const result = { price: '0' }
  response.split('\n').forEach(res => {
    const key = 'Price is:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.price = data
      } else {
        result.message = 'not able to request'
      }
    }
  })
  return result
}

/**
 * @param {string} pricefeedaddress - Reference: https://docs.chain.link/data-feeds/price-feeds/addresses/?network=klaytn
 * @returns {Promise} result
 */
async function changeChainLinkPriceFeed (pricefeedaddress) {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.chainLinkPriceFeed) {
    throw new Error('ChainLinkPriceFeed contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat change-price-feed --contract ${jsonData.chainLinkPriceFeed} --pricefeedaddress ${pricefeedaddress} --network ${jsonData.network}`)
  console.log(response)
  const result = { }
  response.split('\n').forEach(res => {
    const key = 'Transaction Hash:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.txnHash = data
      } else {
        result.message = 'not able to change pricefeed'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} deployment info
 */
async function deployChainLinkApiData () {
  await command(`cd ${__dirname} && npx hardhat deploy --tags api`)
  return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath)).chainLinkApiData }
}

/**
 * @returns {Promise} result
 */
async function fundChainLinkApiData () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.chainLinkApiData) {
    throw new Error('ChainLinkApiData contract not deployed')
  }
  console.log("**WARNING**: 'chainlink-plugin-fund-link' have not supported 'baobab network'. You have to fund link manually")
  const response = await command(`cd ${__dirname} && npx hardhat fund-link --contract ${jsonData.chainLinkApiData} --network ${jsonData.network}`)
  console.log(response)
  const result = { }
  response.split('\n').forEach(res => {
    const key = 'Transaction Hash:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.txnHash = data
      } else {
        result.message = 'not able to request'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} result
 */
async function requestChainLinkApiData (coinsymbol, coindecimals) {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.chainLinkApiData) {
    throw new Error('ChainLinkApiData contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat request-data --contract ${jsonData.chainLinkApiData} --coinsymbol ${coinsymbol} --coindecimals ${coindecimals} --network ${jsonData.network}`)
  console.log(response)
  const result = { }
  response.split('\n').forEach(res => {
    const key = 'Transaction Hash:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.txnHash = data
      } else {
        result.message = 'not able to request'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} result
 */
async function readChainLinkApiData () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.chainLinkApiData) {
    throw new Error('ChainLinkApiData contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat read-data --contract ${jsonData.chainLinkApiData} --network ${jsonData.network}`)
  console.log(response)
  const result = { data: '' }
  response.split('\n').forEach(res => {
    const key = 'Data is:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.data = data
      } else {
        result.message = 'not able to request'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} deployment info
 */
async function deployChainLinkRandomNumber () {
  await command(`cd ${__dirname} && npx hardhat deploy --tags vrf`)
  return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath)).chainLinkRandomNumber }
}

/**
 * @returns {Promise} response
 */
async function requestChainLinkRandomNumber (_numWords=2) {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.chainLinkRandomNumber) {
    throw new Error('ChainlinkRandomNumber contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat request-random-number --contract ${jsonData.chainLinkRandomNumber} --numwords ${_numWords} --network ${jsonData.network}`)
  console.log(response)
  const result = { }
  response.split('\n').forEach(res => {
    const key = 'Transaction Hash:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.txnHash = data
      } else {
        result.message = 'not able to request'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} result
 */
async function readChainLinkRandomNumber () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.chainLinkRandomNumber) {
    throw new Error('ChainlinkRandomNumber contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat read-random-number --contract ${jsonData.chainLinkRandomNumber} --network ${jsonData.network}`)
  console.log(response)
  const result = { randomNumbers: [] }
  response.split('\n').forEach(res => {
    const key = 'Random Numbers are:'
    if (res.indexOf(key) > -1) {
      let data = res.replace(key, '').trim().split(',')

      if (data && data.length > 0) {
        data = data.map(rand => rand.trim())
        result.randomNumbers = data
      } else {
        result.message = 'not able to fetch the data'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} deployment info
 */
async function deployChainLinkKeepersCounter () {
  await command(`cd ${__dirname} && npx hardhat deploy --tags keepers`)
  return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath)).keepersCounter }
}

/**
 * @returns {Promise} result
 */
async function readChainLinkKeepersCounter () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.keepersCounter) {
    throw new Error('contract not deployed')
  }
  console.log(`**WARNING** The Baobab network is not supported by Chainlink Automation (aka Chainlink Keepers) yet. 
    Because of that, the response of the Keeper will always be 0. You can ignore this feature in the current version.`)

  const response = await command(`cd ${__dirname} && npx hardhat read-keepers-counter --contract ${jsonData.keepersCounter} --network ${jsonData.network}`)
  console.log(response)
  const result = { counter: 0 }
  response.split('\n').forEach(res => {
    const key = 'Counter is:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.counter = data
      } else {
        result.message = 'not able to fetch the data'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} deployment info
 */
async function deployWitnetPriceFeed () {
  await command(`cd ${__dirname} && npx hardhat deploy --tags witnet-feed`)
  return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath)).witnetPriceFeed }
}

/**
 * @param id - https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses/klaytn-price-feeds#klaytn-baobab ex: 0x6cc828d1
 * @returns {Promise} result
 */
async function readWitnetPriceFeed (id) {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.witnetPriceFeed) {
    throw new Error('contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat read-witnet-price-feed --contract ${jsonData.witnetPriceFeed} --id ${id} --network ${jsonData.network}`)
  console.log(response)
  const result = { price: '0' }
  response.split('\n').forEach(res => {
    const key = 'Last price is:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.price = data
      } else {
        result.message = 'not able to fetch the data'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} deployment info
 */
async function deployWitnetRandomNumber () {
  await command(`cd ${__dirname} && npx hardhat deploy --tags witnet-random`)
  return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath)).witnetRandomNumber }
}

/**
 * @returns {Promise} result
 */
async function requestWitnetRandomness () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.witnetRandomNumber) {
    throw new Error('contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat request-witnet-randomness --contract ${jsonData.witnetRandomNumber} --value 1000000000000000000 --network ${jsonData.network}`)
  console.log(response)
  const result = { }
  response.split('\n').forEach(res => {
    const key = 'Transaction Hash:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.txnHash = data
      } else {
        result.message = 'not able to fetch the data'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} result
 */
async function readWitnetLatestRandomizingBlock () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.witnetRandomNumber) {
    throw new Error('contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat read-latest-randomizing-block --contract ${jsonData.witnetRandomNumber} --network ${jsonData.network}`)
  console.log(response)
  const result = { randomizingBlock: 0 }
  response.split('\n').forEach(res => {
    const key = 'The latest randomizing block is:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.randomizingBlock = data
      } else {
        result.message = 'not able to fetch the data'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} result
 */
async function fetchWitnetRandomNumber () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.witnetRandomNumber) {
    throw new Error('contract not deployed')
  }
  const response = await command(`cd ${__dirname} && npx hardhat fetch-witnet-random-number --contract ${jsonData.witnetRandomNumber} --network ${jsonData.network}`)
  const result = { }
  response.split('\n').forEach(res => {
    const key = 'Transaction Hash:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.txnHash = data
      } else {
        result.message = 'not able to fetch the data'
      }
    }
  })
  return result
}

/**
 * @returns {Promise} result
 */
async function readWitnetRandomNumber () {
  if (!fs.existsSync(deployedContractsSourcePath)) {
    throw new Error('Please deploy the contracts')
  }
  const jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath))
  if (!jsonData.witnetRandomNumber) {
    throw new Error('contract not deployed')
  }
  console.log(`**WARNING** Calling read immediately after request will most likely cause the transaction to revert. 
    Please allow 5-10 minutes for the randomization request to complete`)
  const response = await command(`cd ${__dirname} && npx hardhat read-witnet-random-number --contract ${jsonData.witnetRandomNumber} --network ${jsonData.network}`)
  console.log(response)
  const result = { randomNumber: '0' }
  response.split('\n').forEach(res => {
    console.log(res)
    const key = 'Random Number is:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.randomNumber = data
      } else {
        result.message = 'not able to fetch the data'
      }
    }
  })
  return result
}

/**
 * @param {Object} coinPriceData
 * @param {string} coinPriceData.coinSymbol - coinsymbol from cryptocompare.com and api.coinbase.com 
 * @param {Object} postRequestData
 * @param {string} postRequestData.url - post api url
 * @param {string} postRequestData.body - post api input body
 * @param {Object} postRequestData.headers - post api headers
 * @param {Array} postRequestData.jsonPath - parse response result
 * @returns {Promise} compile info
 */
function compileWitnetQueriesToSolidityContracts (coinPriceData, postRequestData) {
  
  if(coinPriceData && coinPriceData.coinSymbol) {
    let filePath = path.join(__dirname, 'witnet-queries', 'coinPrice.js')
    filePath = filePath.replaceAll("\\", "/")
    let data = fs.readFileSync(filePath, 'utf8')
    let searchString = 'let coinSymbol ='
    let re = new RegExp(searchString + '.*$', 'gm')
    let formatted = data.replace(re, `let coinSymbol = "${coinPriceData.coinSymbol}"`)
    fs.writeFileSync(filePath, formatted, 'utf8')
  }

  if(postRequestData && postRequestData.url) {
    let filePath = path.join(__dirname, 'witnet-queries', 'postAPI.js')
    filePath = filePath.replaceAll("\\", "/")
    let data = fs.readFileSync(filePath, 'utf8')

    let searchString = 'let url ='
    let re = new RegExp(searchString + '.*$', 'gm')
    data = data.replace(re, `let url = "${postRequestData.url}"`)

    searchString = 'let body ='
    re = new RegExp(searchString + '.*$', 'gm')
    data = data.replace(re, `let body = "${postRequestData.body}"`)

    searchString = 'let headers ='
    re = new RegExp(searchString + '.*$', 'gm')
    data = data.replace(re, `let headers = ${JSON.stringify(postRequestData.headers)}`)

    searchString = 'let jsonPath ='
    re = new RegExp(searchString + '.*$', 'gm')
    data = data.replace(re, `let jsonPath = ${JSON.stringify(postRequestData.jsonPath)}`)

    fs.writeFileSync(filePath, data, 'utf8')
  }

  const witnetSolidityBridgeSourcePath = path.join(__dirname, 'node_modules', 'witnet-solidity-bridge')
  if (!fs.existsSync(witnetSolidityBridgeSourcePath)) {
    if (fs.existsSync(path.join(__dirname, '..', 'witnet-solidity-bridge'))) {
      try {
        fs.copySync(path.join(__dirname, '..', 'witnet-solidity-bridge'), witnetSolidityBridgeSourcePath, { overwrite: true | false })
        console.log('copied witnet-solidity-bridge node_modules')
      } catch (err) {
        console.log(err)
      }
    }
  }
  return command(`cd ${__dirname} && npx --yes rad2sol --target ${path.join(__dirname, 'witnet-queries')} --write-contracts ${path.join(__dirname, 'contracts', 'witnet-requests')}`)
}

/**
 * @returns {Object} compiled witnet query sol files
 */
function getCompiledWitnetQueriesSolFiles () {

  const witnetSolidityBridgeSourcePath = path.join(__dirname, 'node_modules', 'witnet-solidity-bridge')
  if (!fs.existsSync(witnetSolidityBridgeSourcePath)) {
    if (fs.existsSync(path.join(__dirname, '..', 'witnet-solidity-bridge'))) {
      try {
        fs.copySync(path.join(__dirname, '..', 'witnet-solidity-bridge'), witnetSolidityBridgeSourcePath, { overwrite: true | false })
        console.log('copied witnet-solidity-bridge node_modules')
      } catch (err) {
        console.log(err)
      }
    }
  }
  const queryPath = path.join(__dirname, 'contracts', 'witnet-requests')
  const fileNames = fs.readdirSync(queryPath, { withFileTypes: true }).filter(item => !item.isDirectory()).map(item => item.name)
  return fileNames
}
/**
 * @returns {Promise} query info
 */
async function tryWitnetQueries (contractFileName) {
  const witnetSolidityBridgeSourcePath = path.join(__dirname, 'node_modules', 'witnet-solidity-bridge')
  if (!fs.existsSync(witnetSolidityBridgeSourcePath)) {
    if (fs.existsSync(path.join(__dirname, '..', 'witnet-solidity-bridge'))) {
      try {
        fs.copySync(path.join(__dirname, '..', 'witnet-solidity-bridge'), witnetSolidityBridgeSourcePath, { overwrite: true | false })
        console.log('copied witnet-solidity-bridge node_modules')
      } catch (err) {
        console.log(err)
      }
    }
  }
  let filePath = path.join(__dirname, 'contracts', 'witnet-requests', contractFileName);
  filePath = filePath.replaceAll("\\", "/");
  console.log(filePath);
  let response = await command(`npx --yes witnet-toolkit try-query --from-solidity ${filePath}`)
  const result = { value: '' }
  response.split('\n').forEach(res => {
    const key = 'Result:'
    if (res.indexOf(key) > -1) {
      const data = res.replace(key, '').trim()
      if (data) {
        result.value = data.split(":")[1].trim();
      } else {
        result.message = 'not able to fetch the data'
      }
    }
  })
  return result;
}

module.exports = {
  setVariables,
  getVariables,
  setBaobabHardhatConfigurations,
  getBaobabHardhatConfigurations,
  compile,
  deployAll,
  readDeployedContracts,
  deployChainLinkPriceFeed,
  changeChainLinkPriceFeed,
  readChainLinkPriceFeed,
  deployChainLinkApiData,
  fundChainLinkApiData,
  requestChainLinkApiData,
  readChainLinkApiData,
  deployChainLinkRandomNumber,
  requestChainLinkRandomNumber,
  readChainLinkRandomNumber,
  deployChainLinkKeepersCounter,
  readChainLinkKeepersCounter,
  deployWitnetPriceFeed,
  readWitnetPriceFeed,
  deployWitnetRandomNumber,
  requestWitnetRandomness,
  readWitnetLatestRandomizingBlock,
  fetchWitnetRandomNumber,
  readWitnetRandomNumber,
  compileWitnetQueriesToSolidityContracts,
  getCompiledWitnetQueriesSolFiles,
  tryWitnetQueries
}
