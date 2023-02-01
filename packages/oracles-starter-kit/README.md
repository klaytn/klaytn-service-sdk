# Oracle Starter Kit
- [Oracle Starter Kit](#oracle-starter-kit)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Setup Hardhat configurations Baobab Klaytn network and variables](#setup-hardhat-configurations-baobab-klaytn-network-and-variables)
    - [1. Hardhat configurations](#1-hardhat-configurations)
      - [Fetch Hardhat configurations](#fetch-hardhat-configurations)
        - [Returns](#returns)
        - [Example](#example)
      - [Setup Hardhat configurations](#setup-hardhat-configurations)
        - [Parameters](#parameters)
        - [Example](#example-1)
    - [2. Environment Variables](#2-environment-variables)
      - [Fetch Environment variables](#fetch-environment-variables)
        - [Returns](#returns-1)
        - [Example](#example-2)
      - [Setup Environment variables](#setup-environment-variables)
        - [Parameters](#parameters-1)
        - [Example](#example-3)
  - [Deploy contracts](#deploy-contracts)
  - [Interacting with Deployed Contracts](#interacting-with-deployed-contracts)
    - [Deployed Contracts](#deployed-contracts)
      - [Returns](#returns-2)
      - [Example](#example-4)
    - [Chainlink Price Feeds](#chainlink-price-feeds)
      - [Returns](#returns-3)
      - [Example](#example-5)
    - [Change Chainlink price feed address](#change-chainlink-price-feed-address)
      - [Parameters](#parameters-2)
      - [Returns](#returns-4)
      - [Example](#example-6)
    - [Chainlink Request \& Receive Data](#chainlink-request--receive-data)
      - [Fund ChainLinkAPI contract](#fund-chainlinkapi-contract)
        - [Returns](#returns-5)
      - [Request ChainLinkAPI Data](#request-chainlinkapi-data)
        - [Parameters](#parameters-3)
        - [Returns](#returns-6)
        - [Example](#example-7)
      - [Request ChainLinkAPI Data](#request-chainlinkapi-data-1)
        - [Returns](#returns-7)
        - [Example](#example-8)
    - [Chainlink VRF Get a random number](#chainlink-vrf-get-a-random-number)
      - [Prerequisite](#prerequisite)
      - [Request Chainlink Random number](#request-chainlink-random-number)
        - [Parameters](#parameters-4)
        - [Returns](#returns-8)
        - [Example](#example-9)
      - [Read Chainlink Random number](#read-chainlink-random-number)
        - [Returns](#returns-9)
        - [Example](#example-10)
    - [Chainlink Keepers](#chainlink-keepers)
    - [Witnet Price Feeds](#witnet-price-feeds)
      - [Parameters](#parameters-5)
      - [Returns](#returns-10)
      - [Example](#example-11)
    - [Witnet Randomness](#witnet-randomness)
      - [1. Request new randomness](#1-request-new-randomness)
        - [Returns](#returns-11)
        - [Example](#example-12)
      - [2. Fetch Witnet random number](#2-fetch-witnet-random-number)
        - [Returns](#returns-12)
        - [Example](#example-13)
      - [3. Get the latest randomizing block](#3-get-the-latest-randomizing-block)
        - [Returns](#returns-13)
        - [Example](#example-14)
      - [4. Get the generated random number](#4-get-the-generated-random-number)
        - [Returns](#returns-14)
        - [Example](#example-15)
    - [Witnet Web Oracle Request](#witnet-web-oracle-request)
      - [Compile the Witnet queries into Solidity contracts](#compile-the-witnet-queries-into-solidity-contracts)
        - [Parameters](#parameters-6)
        - [Example](#example-16)
      - [fetch the compiled contract filenames](#fetch-the-compiled-contract-filenames)
        - [Returns](#returns-15)
        - [Example](#example-17)
      - [Execute Witnet Queries](#execute-witnet-queries)
        - [Parameters](#parameters-7)
        - [Returns](#returns-16)
        - [Example 1 - Fetch Coinprice](#example-1---fetch-coinprice)
        - [Example 2 - Post Request](#example-2---post-request)
  - [Resources](#resources)

<br/>

## Installation
`npm install @klaytn-developer-sdk/oracles --save`

## Quick Start
OraclesSDK is the package containing the readymade use-cases.

```typescript
const OraclesSDK = require('@klaytn-developer-sdk/oracles');
```

## Setup Hardhat configurations Baobab Klaytn network and variables
Configuration required to perform the OraclesSDK methods.
Default configurations are already using [Klaytn vrf configurations](https://docs.chain.link/vrf/v2/subscription/supported-networks/).

### 1. Hardhat configurations

#### Fetch Hardhat configurations
fetches the hardhat configurations

```
OracleSDK.getBaobabHardhatConfigurations()
```

##### Returns
`Object` - hardhat configuration
  * `name` - hardhat network name Ex: `baobab`
  * `linkToken` - chainlink linktoken address. see [Link Token Address](https://docs.chain.link/vrf/v2/subscription/supported-networks/) for reference.
  * `keyHash` - chainlink keyHash. see [KeyHash Configurations](https://docs.chain.link/vrf/v2/subscription/supported-networks/) for reference.
  * `chainLinkPriceFeed` - chainlink pricefeed address for contract deployment. Ex: `0xf49f81b3d2F2a79b706621FA2D5934136352140c`. see [Chainlink Pricefeed Addresses](https://docs.chain.link/data-feeds/price-feeds/addresses/?network=klaytn) for reference.
  * `oracle` - chainlink oracle contract address. see [Klaytn Operator Contracts](https://docs.chain.link/any-api/testnet-oracles/#examples) for reference.
  * `jobId` - chainlink jobId. Ex: `ca98366cc7314957b8c012c72f05aeeb`. see [Chainlink JobID's](https://docs.chain.link/any-api/testnet-oracles/#jobs) for reference.
  * `vrfCoordinator` - vrfCoordinator. see [VRF Coordinator](https://docs.chain.link/vrf/v2/subscription/supported-networks/) for reference.
  * `witnetPriceRouter` - witnetPriceRouter Address Ex: `0xeD074DA2A76FD2Ca90C1508930b4FB4420e413B0` for Klaytn Testnet. See [WitnetPriceRouter](https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses/klaytn-price-feeds#klaytn-baobab) for reference.
  * `witnetRandomness` - witnetRandomness Address. Ex: `0xb4b2e2e00e9d6e5490d55623e4f403ec84c6d33f` for Klaytn Testnet. See [WitnetRandomness Contract Addresses](https://docs.witnet.io/smart-contracts/witnet-randomness-oracle/contract-addresses#klaytn) for reference.
  * `fee` - fee
  * `fundAmount` - fundAmount
  
##### Example
```typescript
const OraclesSDK = require('@klaytn-developer-sdk/oracles');

console.log(OracleSDK.getBaobabHardhatConfigurations)
/*
  {
    name: 'baobab',
    linkToken: '0x04c5046A1f4E3fFf094c26dFCAA75eF293932f18',
    keyHash: '0x9be50e2346ee6abe000e6d3a34245e1d232c669703efc44660a413854427027c',
    chainLinkPriceFeed: '0xf49f81b3d2F2a79b706621FA2D5934136352140c',
    oracle: '0xfC3BdAbD8a6A73B40010350E2a61716a21c87610',
    jobId: 'ca98366cc7314957b8c012c72f05aeeb',
    vrfCoordinator: '0x771143FcB645128b07E41D79D82BE707ad8bDa1C',
    witnetPriceRouter: '0xeD074DA2A76FD2Ca90C1508930b4FB4420e413B0',
    witnetRandomness: '0xb4b2e2e00e9d6e5490d55623e4f403ec84c6d33f',
    fee: '100000000000000',
    fundAmount: '100000000000000'
  }
*/
```
#### Setup Hardhat configurations
Modify and execute below method to change the Hardhat configurations

> **_NOTE:_**  This command will modify the `helper-hardhat-config.json` in the package node_modules.

```
OracleSDK.setBaobabHardhatConfigurations(hardhatConfiguration)
```

##### Parameters
`Object` - hardhat configuration
  * `name` - hardhat network name Ex: `baobab`
  * `linkToken` - chainlink linktoken address. see [Link Token Address](https://docs.chain.link/vrf/v2/subscription/supported-networks/) for reference.
  * `keyHash` - chainlink keyHash. see [KeyHash Configurations](https://docs.chain.link/vrf/v2/subscription/supported-networks/) for reference.
  * `chainLinkPriceFeed` - chainlink pricefeed address for contract deployment. Ex: `0xf49f81b3d2F2a79b706621FA2D5934136352140c`. see [Chainlink Pricefeed Addresses](https://docs.chain.link/data-feeds/price-feeds/addresses/?network=klaytn) for reference.
  * `oracle` - chainlink oracle contract address. see [Klaytn Operator Contracts](https://docs.chain.link/any-api/testnet-oracles/#examples) for reference.
  * `jobId` - chainlink jobId. Ex: `ca98366cc7314957b8c012c72f05aeeb`. see [Chainlink JobID's](https://docs.chain.link/any-api/testnet-oracles/#jobs) for reference.
  * `vrfCoordinator` - vrfCoordinator. see [VRF Coordinator](https://docs.chain.link/vrf/v2/subscription/supported-networks/) for reference.
  * `witnetPriceRouter` - witnetPriceRouter Address Ex: `0xeD074DA2A76FD2Ca90C1508930b4FB4420e413B0` for Klaytn Testnet. See [WitnetPriceRouter](https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses/klaytn-price-feeds#klaytn-baobab) for reference.
  * `witnetRandomness` - witnetRandomness Address. Ex: `0xb4b2e2e00e9d6e5490d55623e4f403ec84c6d33f` for Klaytn Testnet. See [WitnetRandomness Contract Addresses](https://docs.witnet.io/smart-contracts/witnet-randomness-oracle/contract-addresses#klaytn) for reference.
  * `fee` - fee
  * `fundAmount` - fundAmount

##### Example
```typescript
const OraclesSDK = require('@klaytn-developer-sdk/oracles');

//Default Configurations are as shown below
let hardhatConfiguration = {
    name: 'baobab',
    linkToken: '0x04c5046A1f4E3fFf094c26dFCAA75eF293932f18',
    keyHash: '0x9be50e2346ee6abe000e6d3a34245e1d232c669703efc44660a413854427027c',
    chainLinkPriceFeed: '0xf49f81b3d2F2a79b706621FA2D5934136352140c',
    oracle: '0xfC3BdAbD8a6A73B40010350E2a61716a21c87610',
    jobId: 'ca98366cc7314957b8c012c72f05aeeb',
    vrfCoordinator: '0x771143FcB645128b07E41D79D82BE707ad8bDa1C',
    witnetPriceRouter: '0xeD074DA2A76FD2Ca90C1508930b4FB4420e413B0',
    witnetRandomness: '0xb4b2e2e00e9d6e5490d55623e4f403ec84c6d33f',
    fee: '100000000000000',
    fundAmount: '100000000000000'
  };

OracleSDK.setBaobabHardhatConfigurations(hardhatConfiguration)
```

### 2. Environment Variables
First, we will need to set environment variables. We can do so by using below commands.

#### Fetch Environment variables
Fetchs the environment variables. This are retrieved from .env file of package in node_modules.

```typescript
OracleSDK.getVariables()
```

##### Returns
`Object`
  * `BAOBAB_RPC_URL` - `String` baobab rpc url
  * `PRIVATE_KEY` - `String` private key
  * `AUTO_FUND` - `Boolean` provide true, if needs to autofund
  * `VRF_SUBSCRIPTION_ID` - `integer` vrf subscription id 

##### Example

```typescript
const OraclesSDK = require('@klaytn-developer-sdk/oracles');

console.log(OraclesSDK.getVariables());
/*
{
    BAOBAB_RPC_URL: 'https://api.baobab.klaytn.net:8651', 
    PRIVATE_KEY: '', 
    AUTO_FUND: true, 
    VRF_SUBSCRIPTION_ID: 114
}
*/
```

#### Setup Environment variables
Use below command to set the environment variables.

```typescript
OracleSDK.setVariables(config)
```
> IMPORTANT: MAKE SURE YOU DON'T EXPOSE THE KEYS YOU PUT IN THIS `.env` FILE saved in the package node_modules. By that, I mean don't push them to a public repo, and please try to keep them keys you use in development not associated with any real funds. 

Don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

> Get some Baobab Testnet KLAY and LINK 
Go to the [Klaytn faucets](https://baobab.wallet.klaytn.foundation/faucet) to get some KLAY to configured private key account.
Head over to the [Chainlink faucets](https://faucets.chain.link/) and get some LINK to configured private key account. Please follow [the chainlink documentation](https://docs.chain.link/docs/acquire-link/) if unfamiliar. 

##### Parameters
`Object` - config
  *  `BAOBAB_RPC_URL` - `String` https://api.baobab.klaytn.net:8651/ can be used. its the rpc url of blockchain.
  *  `PRIVATE_KEY` - `String` This is private key from wallet, ie [MetaMask](https://metamask.io/). This is required for deploying contracts to public networks. 
  *  `AUTO_FUND` - `Boolean`
  *  `VRF_SUBSCRIPTION_ID`: `integer` VRF Subscription id. Head over to [VRF Subscription Page](https://vrf.chain.link/klaytn-testnet) and create the new subscription.


##### Example
```typescript
const OraclesSDK = require('@klaytn-developer-sdk/oracles');

let config = {
    BAOBAB_RPC_URL: 'https://api.baobab.klaytn.net:8651', 
    PRIVATE_KEY: 'Private key here', 
    AUTO_FUND: true, 
    VRF_SUBSCRIPTION_ID: 114
};

OracleSDK.setVariables(config)
```

## Deploy contracts

You should now be all setup! You can run any method now! Since we configured the environment variables and hardhat configurations so you don't really need to pass any configurations.

To deploy all contracts
```
OracleSDK.deployAll().then(result => console.log(result))
```

or 

To deploy individual contracts:
```
OracleSDK.deployChainLinkPriceFeed().then(result => console.log(result))
OracleSDK.deployChainLinkApiData().then(result => console.log(result))
OracleSDK.deployChainLinkRandomNumber().then(result => console.log(result))
OracleSDK.deployChainLinkKeepersCounter().then(result => console.log(result))
OracleSDK.deployWitnetPriceFeed().then(result => console.log(result))
OracleSDK.deployWitnetRandomNumber().then(result => console.log(result))
```

## Interacting with Deployed Contracts

After deploying your contracts, the deployment output will give you the contract addresses as they are deployed and also stored in `deployedContracts.json` within the node_modules. You can then use these contract addresses in conjunction with Hardhat tasks to perform operations on each contract.

### Deployed Contracts
To fetch the deployed contracts:
```
console.log(OracleSDK.readDeployedContracts())
```
#### Returns
`Object`
  * `chainLinkPriceFeed` - `String` Chainlink Deployed pricefeed contract
  * `chainLinkApiData` - `String` Chainlink Deployed chainLinkApiData contract
  * `chainLinkRandomNumber` - `String` Chainlink Deployed chainLinkRandomNumber contract
  * `keepersCounter` - `String` Chainlink Deployed keepers contract
  * `witnetPriceFeed` - `String` Witnet Deployed pricefeed contract
  * `witnetRandomNumber` - `String` Witnet Deployed RandomNumber contract
  * `network` - `String` network name

#### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  console.log(OracleSDK.readDeployedContracts())
  /*
  {
    chainLinkPriceFeed: '0x6883956A235f8b823d547575812B08F4a720D76A',
    chainLinkApiData: '0xddDC43f1ae46757C94Ec6dCDAa7E9b6738e0db0b',
    chainLinkRandomNumber: '0x3AFb1Ce6B16EcB1e367cCC23d99Ea4D9Ef497BE3',
    keepersCounter: '0x597BCEc176AB72C44075b9Cd17e5824e43BD46f8',
    witnetPriceFeed: '0x37291E5036db32DFe714823dE7A96253676e6487',
    witnetRandomNumber: '0x8937C127F3060fF8a23E9a0fb5AEA10bc30e28be',
    network: 'baobab'
  }
  */
```

### Chainlink Price Feeds
The Price Feeds consumer contract has one task, to read the latest price of a specified price feed contract

```bash
OracleSDK.readChainLinkPriceFeed()
```
#### Returns
Promise `Object`
  * `price` - price

#### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  // By default it returns LINK/KLAY price feed value. 1 LINK = 32.9 KLAY
  OracleSDK.readChainLinkPriceFeed().then(result => console.log(result))
  /*
  { price: '32915338976573950000' }
  */
```

### Change Chainlink price feed address
The price feed address used while deployment can be changed using below method. 

```bash
OracleSDK.changeChainLinkPriceFeed(pricefeedAddress)
```

#### Parameters
`pricefeedAddress` - pricefeed address. see [Klaytn Pricefeed Addresses](https://docs.chain.link/data-feeds/price-feeds/addresses/?network=klaytn) for reference.

#### Returns
Promise `Object`
  * `txnHash` - `String` transaction hash

#### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  // Change to WEMIX/USD 0x76Aa17dCda9E8529149E76e9ffaE4aD1C4AD701B price feed contract. 1 LINK = 32.9 KLAY
  OracleSDK.changeChainLinkPriceFeed("0x76Aa17dCda9E8529149E76e9ffaE4aD1C4AD701B").then(async (result) => {
    console.log(result.txnHash);

    await new Promise(r => setTimeout(r, 2000));
    // 1 WEMIX = 0.8 USD
    OracleSDK.readChainLinkPriceFeed().then(result => console.log(result))
  })
  /*
  0x0741df94b257a29f73ff4b94d2f0d5cd91dae20f2bc9946dd00a954905d85936
  { price: '800625678041836600' }
  */
```

### Chainlink Request & Receive Data
The APIConsumer contract has two tasks, one to request external data based on a set of parameters, and one to check to see what the result of the data request is. 
Currently fetches the volume24hour data from https://min-api.cryptocompare.com/data/pricemultifull?fsyms=KLAY&tsyms=USD.

#### Fund ChainLinkAPI contract
This chainLinkApiData contract needs to be funded with `link` tokens first.

```bash
fundChainLinkApiData()
```

##### Returns
Promise `Object`
  * `txnHash` - `String` transaction hash

> **WARNING**: `chainlink-plugin-fund-link` have not supported `baobab network`. You have to fund `link` tokens manually to the deployed chainLinkApiData contract. Get deployed contracts list using `console.log(OracleSDK.readDeployedContracts())` method.

#### Request ChainLinkAPI Data
Once the deployed chainlinkAPI contract it's funded with `link` tokens, you can request external data by passing in a number of parameters to the request-data task. 

```bash
OracleSDK.requestChainLinkApiData(coinsymbol, coindecimals)
```
##### Parameters
1. `coinsymbol` - coinsymbol. see [Coin Symbols](https://min-api.cryptocompare.com) for reference.
2. `coindecimals` - coin supported decimals. Ex: 18 for KLAY
  
##### Returns
Promise `Object`
  * `txnHash` - `String` transaction hash

##### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  // Change to WEMIX/USD 0x76Aa17dCda9E8529149E76e9ffaE4aD1C4AD701B price feed contract. 1 LINK = 32.9 KLAY
  OracleSDK.requestChainLinkApiData("KLAY", 18).then((result) => {
    console.log(result.txnHash);
  })
  /*
    0xe8f3d600a4789d16b0a0a9a739d67bbefcb088aebbc038687c4c9e7b1d56373a
  */
```
#### Request ChainLinkAPI Data
Once you have successfully made a request for external data, you can see the result via the read-data task. it retrives VOLUME24 from https://min-api.cryptocompare.com/data/pricemultifull?fsyms=KLAY&tsyms=USD from the contract

```bash
OracleSDK.readChainLinkApiData()
```

##### Returns
Promise `Object`
  * `data` - `String` Receives `volume24` data without decimals

##### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  // Receives volume24 from RAW.KLAY.USD.VOLUME24HOUR in "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=KLAY&tsyms=USD" result without decimals
  OracleSDK.readChainLinkApiData("KLAY", 18).then((result) => {
    console.log(result);
  })
  /*
    { data: '76993244391264860000000000' }
  */
```

### Chainlink VRF Get a random number
The VRFConsumer contract has two tasks, one to request a random number, and one to read the result of the random number request.

#### Prerequisite
To start, go to [VRF Subscription Page](https://vrf.chain.link/klaytn-testnet) and create the new subscription. Save your subscription ID and put it in environment variables as `VRF_SUBSCRIPTION_ID` using `setVariables` method:

```bash
OracleSDK.setVariables({
  VRF_SUBSCRIPTION_ID=subscription_id
})
```

Then, deploy your VRF V2 contract consumer(if its not deployed already with the subscription id) to the network with your recent subscription using subscription id as constructor argument.

```bash
OracleSDK.deployChainLinkRandomNumber().then(result => console.log(result))  
```

Finally, you need to go to your subscription page one more time and add the address of deployed contract as a new consumer (https://vrf.chain.link/klaytn-testnet/<subscriptionid>). Once that's done, you can perform a VRF request with the request-random-number task.
> **_NOTE:_**  Make sure to add LINK funds to the subscription from the chainlink UI screen:

#### Request Chainlink Random number

```bash
OracleSDK.requestChainLinkRandomNumber()
```

##### Parameters
`randomNumbersCount` - `integer` No of random numbers to be generated

##### Returns
Promise `Object`
  * `txnHash` - `String` Transaction hash

##### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  let randomNumbersCount = 3; // No of random numbers to be generated
  OracleSDK.requestChainLinkRandomNumber(randomNumbersCount).then((result) => {
    console.log(result);
  })
  /*
    {
      txnHash: '0x770892fb09f00fbc25aa4118c4e59bae8f106e550d9295ddab62db79d708821a'
    }
  */
```

#### Read Chainlink Random number
Once you have successfully made a request for a random number, you can see the result via the read-random-number task:

```bash
OracleSDK.readChainLinkRandomNumber()
```

##### Returns
Promise `Object`
  * `randomNumbers` - `Array` Array of random numbers

##### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  OracleSDK.readChainLinkRandomNumber().then((result) => {
    console.log(result);
  })
  /*
    {
      randomNumbers: [
        '25039093979060057973217505519617231457599792522931877947740225763662111327605',
        '66221833599132925893563674221180186695699650058371972286077266023247996014608',
        '62169596737219453842215058746401741770368274717351892705020984286494216685598'
      ]
    }
  */
```

### Chainlink Keepers
<!-- The KeepersCounter contract is a simple Chainlink Keepers enabled contract that simply maintains a counter variable that gets incremented each time the performUpkeep task is performed by a Chainlink Keeper. Once the contract is deployed, you should head to [https://keepers.chain.link/](https://keepers.chain.link/) to register it for upkeeps, then you can use the task below to view the counter variable that gets incremented by Chainlink Keepers


```bash
readChainLinkKeepersCounter().then(result => console.log(result));
``` -->
> **WARNING**:
The Baobab network is not supported by Chainlink Automation (aka Chainlink Keepers) yet. Because of that, the response of the Keeper will always be 0. You can ignore this feature in the current version.

<br/>

### Witnet Price Feeds
The Witnet Price Feeds consumer contract has one task, to read the latest price of a specified price feed contract

```bash
OracleSDK.readWitnetPriceFeed(id)
```

#### Parameters
`id` - `string` id4 is the witnet pricefeed ID. Ex: `0x6cc828d1` for Price-KLAY/USD-6. See [Klaytn Witnet PriceFeeds](https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses/klaytn-price-feeds#klaytn-baobab) for reference.

#### Returns
Promise `Object`
  * `price` - price of KLAY/USD. 

#### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  let id = "0x6cc828d1"; // klaytn witnet pricefeed id
  OracleSDK.readWitnetPriceFeed(id).then((result) => {
    // 1 KLAY = 0.20 USD
    console.log(result);
  })
  /*
    { price: '209744' }
  */
```

### Witnet Randomness
The Witnet Randomness has 4 tasks. 
Make sure the deployWitnetRandomNumber method successful execution.

> This 2-step process preserves unpredictability of the random numbers that you get because it guarantees that the number is derived from a seed that was generated only after the request was sent.

> **_NOTE:_**  Initially 1 and 2nd step has to be completed sequentially. Only after that 3rd or 4th can be executed for fetching a random number.

#### 1. Request new randomness
Requesting the new randomness.
Once the the request to new randomness is performed successfully. The other tasks can be performed after transaction submission.

```bash
OracleSDK.requestWitnetRandomness()
```

##### Returns
Promise `Object`
  * `txnHash` - Transaction hash

##### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  OracleSDK.requestWitnetRandomness().then((result) => {
    console.log(result);
  })
  /*
    {
      txnHash: '0x809addb235dc953c90a563c396c11978a359b574336564c7ec890514c961e050'
    }
  */
```

#### 2. Fetch Witnet random number
Initiate fetch witnet random number transaction.

> **WARNING**:
Calling `fetchWitnetRandomNumber` right after `requestWitnetRandomness` will most likely cause the transaction to revert. Please allow 5-10 minutes for the randomization request to complete

```bash
OracleSDK.fetchWitnetRandomNumber()
```

##### Returns
Promise `Object`
  * `txnHash` - Transaction hash

##### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  OracleSDK.fetchWitnetRandomNumber().then((result) => {
    console.log(result);
  })
  /*
    {
      txnHash: '0x0eb8fe1217ecdc3860009bc49f5319cab6ffdedd80877c39df02899a3542db24'
    }
  */
```

#### 3. Get the latest randomizing block
```bash
OracleSDK.readWitnetLatestRandomizingBlock()
```

##### Returns
Promise `Object`
  * `randomizingBlock` - randomized block value

##### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  OracleSDK.readWitnetLatestRandomizingBlock().then((result) => {
    console.log(result);
  })
  /*
    { randomizingBlock: '113690138' }
  */
```


#### 4. Get the generated random number
fetches the generated random number

> **_NOTE:_** Make sure first 2 steps are executed sequentially.

```bash
OracleSDK.readWitnetRandomNumber()
```

##### Returns
Promise `Object`
  * `randomNumber` - generated random number

##### Example
```typescript
  const OraclesSDK = require('@klaytn-developer-sdk/oracles');

  OracleSDK.readWitnetRandomNumber().then((result) => {
    console.log(result);
  })
  /*
    { randomNumber: '1392104028' }
  */
```

### Witnet Web Oracle Request
We have 2 examples for Witnet HTTP Request:
- KlayPrice: a GET request example to get Klay token price in USD
- postRequestExample: a POST request example echoes back any data and headers that you send in your POST requests (based on this [tutorial](https://docs.witnet.io/smart-contracts/witnet-web-oracle/make-a-post-request))

Inside `witnet-queries` folder you will find predefined Witnet oracle queries.

You can follow this [link](https://docs.witnet.io/smart-contracts/witnet-web-oracle/make-a-get-request) to learn how to create other queries.

#### Compile the Witnet queries into Solidity contracts
```
OracleSDK.compileWitnetQueriesToSolidityContracts(coinPriceData, postApiData)
```

##### Parameters
`coinPriceData` - `Object`
  * `coinSymbol` - `String` coin symbol from cryptocompare.com and api.coinbase.com
`postApiData` - `Object`
  * `url` - `String` post api url
  * `body` - `String` input body parameter
  * `headers` - `Object` headers object
  * `jsonPath` - `Array` json path to resolve for the result obtained

##### Example
```typescript
const OracleSDK = require("@klaytn-developer-sdk/oracles")

let coinPriceData = { coinSymbol: "KLAY" }
let postApiData = {
    url: "https://httpbin.org/post",
    body: "This is the request body",
    headers: { 'Header-Name': 'Header-Value'},
    jsonPath: ["headers", "Header-Name"]
 }
OracleSDK.compileWitnetQueriesToSolidityContracts(coinPriceData, postApiData)

```

#### fetch the compiled contract filenames
```
OracleSDK.getCompiledWitnetQueriesSolFiles();
```

##### Returns
`Array`
  * `contractfile` - `string` contract sol filename

##### Example
```typescript
const OracleSDK = require("@klaytn-developer-sdk/oracles")

console.log(getCompiledWitnetQueriesSolFiles)
/*
  [ 'coinPrice.sol', 'postRequestExample.sol' ]
*/
```

#### Execute Witnet Queries
After the contracts have been created, you can query locally to preview the result by running:
```
OracleSDK.tryWitnetQueries(compiledSolFileName)
```

##### Parameters
`compiledSolFileName` - `String` compiledSolFileName. Call `console.log(OracleSDK.getCompiledWitnetQueriesSolFiles())` to fetch list of compiled sol files and select one as input.

##### Returns
Promise `Object`
  * `value` - `string`

##### Example 1 - Fetch Coinprice
```typescript
const OracleSDK = require("@klaytn-developer-sdk/oracles");

// 1 KLAY = 0.19 USD
OracleSDK.tryWitnetQueries("coinPrice.sol").then(result => {
  // Divide the return value by 10^6 to get actual coin price result.
  console.log(result)
})
/*
{ value: '195467' }
*/
```

##### Example 2 - Post Request
```typescript
const OracleSDK = require("@klaytn-developer-sdk/oracles");

OracleSDK.tryWitnetQueries("postAPI.sol").then(result => {
  console.log(result)
})
/*
  { value: '"Header-Value"' }
*/
```

> **_NOTE:_**  If above tryWitnetQueries is stuck, please try to run command shown in below snapshot `npx witnet-toolkit`, install the binary once in the machine and retry above method
![WitnetToolkitBinary](./WitnetToolkitBinary.png)

## Resources

- [Chainlink Documentation](https://docs.chain.link/)
- [Witnet Documentation](https://docs.witnet.io/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)