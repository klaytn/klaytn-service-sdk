const { exec } = require('node:child_process')
const fs = require("fs-extra");
const envfile = require('envfile')
const sourcePath = __dirname+"/.env";
let deployedContractsSourcePath = __dirname+"/deployedContracts.json";
let hardhatConfigSourcePath = __dirname+"/helper-hardhat-config.json";
let envSourcePath = __dirname+"/.env.example";

function command(_command) {
    return new Promise((resolve, reject) => {
        exec(_command, (err, output) => {
            // once the command has completed, the callback function is called
            if (err) {
                // log and return if we encounter an error
                console.error("could not execute command: ", err);
                reject(err);
                return
            }
            // log the output received from the command
            resolve(output);
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
function setVariables(variableData) {
    try {
        if (!fs.existsSync(sourcePath)) {
            fs.copyFileSync(envSourcePath, sourcePath);
        }
        let parsedFile = envfile.parse(fs.readFileSync(sourcePath));
        Object.keys(variableData).forEach(key => {
            parsedFile[key] = variableData[key];
        })
        fs.writeFileSync(sourcePath, envfile.stringify(parsedFile));
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

/**
 * @returns {Object} variableData 
 * @returns {string} variableData.BAOBAB_RPC_URL - Klaytn testnet RPC URL
 * @returns {string} variableData.PRIVATE_KEY - Users private key
 * @returns {boolean} variableData.AUTO_FUND
 * @returns {number} variableData.VRF_SUBSCRIPTION_ID - Chainlink vrf subscription id
 */
function getVariables() {
    if (!fs.existsSync(sourcePath)) {
        fs.copyFileSync(envSourcePath, sourcePath);
    }
    return envfile.parse(fs.readFileSync(sourcePath));
}

/**
 * @param {Object} config
 */
function setBaobabHardhatConfigurations(config) {
    let jsonData = JSON.parse(fs.readFileSync(hardhatConfigSourcePath));
    jsonData["networkConfig"]["1001"] = {...jsonData["networkConfig"]["1001"], ...config};
    fs.writeFileSync(hardhatConfigSourcePath, JSON.stringify(jsonData));
}

/**
 * @returns {Object} config
 */
function getBaobabHardhatConfigurations() {
    return JSON.parse(fs.readFileSync(hardhatConfigSourcePath))["networkConfig"]["1001"];
}

/**
 * @returns {Promise} compile info
 */
function compile() {
    return command(`cd ${__dirname} && npx hardhat compile`);
}

/**
 * @returns {Promise} deployment info
 */
function deployAll() {
    return command(`cd ${__dirname} && npx hardhat deploy`);
}

/**
 * @returns {Object} deployed contracts
 */
function readDeployedContracts() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("contracts are not deployed");
    }
    return JSON.parse(fs.readFileSync(deployedContractsSourcePath));
}

/**
 * @returns {Promise} deployment info
 */
async function deployChainLinkPriceFeed() {
    await command(`cd ${__dirname} && npx hardhat deploy --tags feed`);
    return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath))["chainLinkPriceFeed"] };
}

/**
 * @returns {Promise} result
 */
async function readChainLinkPriceFeed() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.chainLinkPriceFeed) {
        throw new Error("ChainLinkPriceFeed contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat read-price-feed --contract ${jsonData.chainLinkPriceFeed} --network ${jsonData.network}`);
    console.log(response);
    let result = { price: '0' };
    response.split('\n').forEach(res => {
        let key = "Price is:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.price = data;
            } else {
                result.message = "not able to request";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} deployment info
 */
async function deployChainLinkApiData() {
    await command(`cd ${__dirname} && npx hardhat deploy --tags api`);
    return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath))["chainLinkApiData"] };
}

/**
 * @returns {Promise} result
 */
async function fundChainLinkApiData() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.chainLinkApiData) {
        throw new Error("ChainLinkApiData contract not deployed");
    }
    console.log("**WARNING**: 'chainlink-plugin-fund-link' have not supported 'baobab network'. You have to fund link manually")
    let response = await command(`cd ${__dirname} && npx hardhat fund-link --contract ${jsonData.chainLinkApiData} --network ${jsonData.network}`);
    console.log(response);
    let result = { data: '' };
    response.split('\n').forEach(res => {
        let key = "Transaction Hash:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.data = data;
            } else {
                result.message = "not able to request";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} result
 */
async function requestChainLinkApiData() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.chainLinkApiData) {
        throw new Error("ChainLinkApiData contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat request-data --contract ${jsonData.chainLinkApiData} --network ${jsonData.network}`);
    console.log(response);
    let result = { txHash: '' };
    response.split('\n').forEach(res => {
        let key = "Transaction Hash:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.txHash = data;
            } else {
                result.message = "not able to request";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} result
 */
async function readChainLinkApiData() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.chainLinkApiData) {
        throw new Error("ChainLinkApiData contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat read-data --contract ${jsonData.chainLinkApiData} --network ${jsonData.network}`);
    console.log(response);
    let result = { data: '' };
    response.split('\n').forEach(res => {
        let key = "Data is:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.data = data;
            } else {
                result.message = "not able to request";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} deployment info
 */
async function deployChainLinkRandomNumber() {
    await command(`cd ${__dirname} && npx hardhat deploy --tags vrf`);
    return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath))["chainLinkRandomNumber"] };
}

/**
 * @returns {Promise} response
 */
async function requestChainLinkRandomNumber() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.chainLinkRandomNumber) {
        throw new Error("ChainlinkRandomNumber contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat request-random-number --contract ${jsonData.chainLinkRandomNumber} --network ${jsonData.network}`);
    console.log(response);
    let result = { data: '' };
    response.split('\n').forEach(res => {
        let key = "Transaction Hash:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.data = data;
            } else {
                result.message = "not able to request";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} result
 */
async function readChainLinkRandomNumber() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.chainLinkRandomNumber) {
        throw new Error("ChainlinkRandomNumber contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat read-random-number --contract ${jsonData.chainLinkRandomNumber} --network ${jsonData.network}`);
    console.log(response);
    let result = { randomNumbers: [] };
    response.split('\n').forEach(res => {
        let key = "Random Numbers are:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim().split("and");
            
            if(data && data.length > 0) {
                data = data.map(rand => rand.trim())
                result.randomNumbers = data;
            } else {
                result.message = "not able to fetch the data";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} deployment info
 */
async function deployChainLinkKeepersCounter() {
    await command(`cd ${__dirname} && npx hardhat deploy --tags keepers`);
    return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath))["keepersCounter"] };
}

/**
 * @returns {Promise} result
 */
async function readChainLinkKeepersCounter() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.keepersCounter) {
        throw new Error("contract not deployed");
    }
    console.log(`**WARNING** The Baobab network is not supported by Chainlink Automation (aka Chainlink Keepers) yet. 
    Because of that, the response of the Keeper will always be 0. You can ignore this feature in the current version.`);

    let response = await command(`cd ${__dirname} && npx hardhat read-keepers-counter --contract ${jsonData.keepersCounter} --network ${jsonData.network}`);
    console.log(response);
    let result = { counter: 0 };
    response.split('\n').forEach(res => {
        let key = "Counter is:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.counter = data;
            } else {
                result.message = "not able to fetch the data";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} deployment info
 */
async function deployWitnetPriceFeed() {
    await command(`cd ${__dirname} && npx hardhat deploy --tags witnet-feed`);
    return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath))["witnetPriceFeed"] };
}

/**
 * @returns {Promise} result
 */
async function readWitnetPriceFeed() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.witnetPriceFeed) {
        throw new Error("contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat read-witnet-price-feed --contract ${jsonData.witnetPriceFeed} --network ${jsonData.network}`);
    console.log(response);
    let result = { price: '0' };
    response.split('\n').forEach(res => {
        let key = "Last price is:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.price = data;
            } else {
                result.message = "not able to fetch the data";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} deployment info
 */
async function deployWitnetRandomNumber() {
    await command(`cd ${__dirname} && npx hardhat deploy --tags witnet-random`);
    return { deployedContract: JSON.parse(fs.readFileSync(deployedContractsSourcePath))["witnetRandomNumber"] };
}


/**
 * @returns {Promise} result
 */
async function requestWitnetRandomNumber() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.witnetRandomNumber) {
        throw new Error("contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat request-witnet-random-number --contract ${jsonData.witnetRandomNumber} --value 1000000000000000000 --network ${jsonData.network}`);
    console.log(response);
    let result = { txnHash: '' };
    response.split('\n').forEach(res => {
        let key = "Transaction Hash:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.txnHash = data;
            } else {
                result.message = "not able to fetch the data";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} result
 */
async function readWitnetLatestRandomizingBlock() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.witnetRandomNumber) {
        throw new Error("contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat read-latest-randomizing-block --contract ${jsonData.witnetRandomNumber} --network ${jsonData.network}`);
    console.log(response);
    let result = { randomizingBlock: 0 };
    response.split('\n').forEach(res => {
        let key = "The latest randomizing block is:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.randomizingBlock = data;
            } else {
                result.message = "not able to fetch the data";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} result
 */
async function fetchWitnetRandomNumber() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.witnetRandomNumber) {
        throw new Error("contract not deployed");
    }
    let response = await command(`cd ${__dirname} && npx hardhat fetch-witnet-random-number --contract ${jsonData.witnetRandomNumber} --network ${jsonData.network}`);
    let result = { txnHash: '' };
    response.split('\n').forEach(res => {
        let key = "Transaction Hash:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.txnHash = data;
            } else {
                result.message = "not able to fetch the data";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} result
 */
async function readWitnetRandomNumber() {
    if (!fs.existsSync(deployedContractsSourcePath)) {
        throw new Error("Please deploy the contracts");
    }
    let jsonData = JSON.parse(fs.readFileSync(deployedContractsSourcePath));
    if(!jsonData.witnetRandomNumber) {
        throw new Error("contract not deployed");
    }
    console.log(`**WARNING** Calling read immediately after request will most likely cause the transaction to revert. 
    Please allow 5-10 minutes for the randomization request to complete`);
    let response = await command(`cd ${__dirname} && npx hardhat read-witnet-random-number --contract ${jsonData.witnetRandomNumber} --network ${jsonData.network}`);
    console.log(response);
    let result = { randomNumber: '0' };
    response.split('\n').forEach(res => {
        console.log(res);
        let key = "Random Number is:";
        if(res.indexOf(key) > -1) {
            let data = res.replace(key, "").trim();
            if(data) {
                result.randomNumber = data;
            } else {
                result.message = "not able to fetch the data";
            }
        }
    })
    return result;
}

/**
 * @returns {Promise} compile info
 */
function compileWitnetQueriesToSolidityContracts() {
    let witnetSolidityBridgeSourcePath = `${__dirname}/node_modules/witnet-solidity-bridge`;
    if(!fs.existsSync(witnetSolidityBridgeSourcePath)) {
        if(fs.existsSync(`${__dirname}/../witnet-solidity-bridge`)) {
            try {
                fs.copySync(`${__dirname}/../witnet-solidity-bridge`, witnetSolidityBridgeSourcePath, { overwrite: true|false })
                console.log('copied witnet-solidity-bridge node_modules')
            } catch (err) {
                console.log(err);
            }
        }
    }
    return command(`cd ${__dirname} && npx --yes rad2sol --target ${__dirname}/witnet-queries --write-contracts ${__dirname}/contracts/witnet-requests`);
}

/**
 * @returns {Object} compiled witnet query sol files
 */
function getCompiledWitnetQueriesSolFiles() {
    let witnetSolidityBridgeSourcePath = `${__dirname}/node_modules/witnet-solidity-bridge`;
    if(!fs.existsSync(witnetSolidityBridgeSourcePath)) {
        if(fs.existsSync(`${__dirname}/../witnet-solidity-bridge`)) {
            try {
                fs.copySync(`${__dirname}/../witnet-solidity-bridge`, witnetSolidityBridgeSourcePath, { overwrite: true|false })
                console.log('copied witnet-solidity-bridge node_modules')
            } catch (err) {
                console.log(err);
            }
        }
    }
    let queryPath = __dirname+"/contracts/witnet-requests";
    let fileNames = fs.readdirSync(queryPath, {withFileTypes: true}).filter(item => !item.isDirectory()).map(item => item.name);
    return fileNames;
}
/**
 * @returns {Promise} query info
 */
function tryWitnetQueries(contractFileName) {
    let witnetSolidityBridgeSourcePath = `${__dirname}/node_modules/witnet-solidity-bridge`;
    if(!fs.existsSync(witnetSolidityBridgeSourcePath)) {
        if(fs.existsSync(`${__dirname}/../witnet-solidity-bridge`)) {
            try {
                fs.copySync(`${__dirname}/../witnet-solidity-bridge`, witnetSolidityBridgeSourcePath, { overwrite: true|false })
                console.log('copied witnet-solidity-bridge node_modules')
            } catch (err) {
                console.log(err);
            }
        }
    }
    return command(`cd ${__dirname} && npx --yes witnet-toolkit try-query --from-solidity ${__dirname}/contracts/witnet-requests/${contractFileName}`);
}

module.exports = { 
    setVariables, getVariables, setBaobabHardhatConfigurations, getBaobabHardhatConfigurations, 
    compile, deployAll, readDeployedContracts,
    deployChainLinkPriceFeed, readChainLinkPriceFeed, 
    deployChainLinkApiData, fundChainLinkApiData, requestChainLinkApiData, readChainLinkApiData, 
    deployChainLinkRandomNumber, requestChainLinkRandomNumber, readChainLinkRandomNumber, 
    deployChainLinkKeepersCounter, readChainLinkKeepersCounter,
    deployWitnetPriceFeed, readWitnetPriceFeed,
    deployWitnetRandomNumber, requestWitnetRandomNumber, readWitnetLatestRandomizingBlock, fetchWitnetRandomNumber, readWitnetRandomNumber,
    compileWitnetQueriesToSolidityContracts, getCompiledWitnetQueriesSolFiles, tryWitnetQueries
};