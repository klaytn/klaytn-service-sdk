# Oracle Starter Kit
- [Oracle Starter Kit](#oracle-starter-kit)
  - [Install](#install)
  - [Quick Usage](#quick-usage)
  - [Setup Hardhat configurations Baobab Klaytn network and variables](#setup-hardhat-configurations-baobab-klaytn-network-and-variables)
    - [1. Hardhat configurations](#1-hardhat-configurations)
    - [2. Environment Variables](#2-environment-variables)
  - [Deploy contracts](#deploy-contracts)
  - [Interacting with Deployed Contracts](#interacting-with-deployed-contracts)
    - [Chainlink Price Feeds](#chainlink-price-feeds)
      - [Parameters](#parameters)
      - [Returns](#returns)
      - [Example](#example)
    - [Change Chainlink price feed address](#change-chainlink-price-feed-address)
      - [Parameters](#parameters-1)
      - [Returns](#returns-1)
      - [Example](#example-1)
    - [Chainlink Request \& Receive Data](#chainlink-request--receive-data)
      - [Fund ChainLinkAPI contract](#fund-chainlinkapi-contract)
      - [Parameters](#parameters-2)
        - [Returns](#returns-2)
      - [Request ChainLinkAPI Data](#request-chainlinkapi-data)
        - [Parameters](#parameters-3)
        - [Returns](#returns-3)
        - [Example](#example-2)
      - [Request ChainLinkAPI Data](#request-chainlinkapi-data-1)
        - [Parameters](#parameters-4)
        - [Returns](#returns-4)
        - [Example](#example-3)
    - [Chainlink VRF Get a random number](#chainlink-vrf-get-a-random-number)
      - [Prerequisite](#prerequisite)
      - [Request Chainlink Random number](#request-chainlink-random-number)
        - [Parameters](#parameters-5)
        - [Returns](#returns-5)
        - [Example](#example-4)
      - [Read Chainlink Random number](#read-chainlink-random-number)
        - [Parameters](#parameters-6)
        - [Returns](#returns-6)
        - [Example](#example-5)
    - [Chainlink Keepers](#chainlink-keepers)
    - [Witnet Price Feeds](#witnet-price-feeds)
      - [Parameters](#parameters-7)
      - [Returns](#returns-7)
      - [Example](#example-6)
    - [Witnet Randomness](#witnet-randomness)
      - [1. Request new randomness](#1-request-new-randomness)
      - [Parameters](#parameters-8)
        - [Returns](#returns-8)
        - [Example](#example-7)
      - [2. Fetch Witnet random number](#2-fetch-witnet-random-number)
      - [Parameters](#parameters-9)
        - [Returns](#returns-9)
        - [Example](#example-8)
      - [3. Get the latest randomizing block](#3-get-the-latest-randomizing-block)
      - [Parameters](#parameters-10)
        - [Returns](#returns-10)
        - [Example](#example-9)
      - [4. Get the generated random number](#4-get-the-generated-random-number)
      - [Parameters](#parameters-11)
        - [Returns](#returns-11)
        - [Example](#example-10)
    - [Witnet Web Oracle Request](#witnet-web-oracle-request)
      - [Compile the Witnet queries into Solidity contracts](#compile-the-witnet-queries-into-solidity-contracts)
        - [Example](#example-11)
      - [Execute Witnet Queries](#execute-witnet-queries)
        - [Parameters](#parameters-12)
        - [Returns](#returns-12)
        - [Example 1 - Fetch Coinprice](#example-1---fetch-coinprice)
        - [Example 2 - Post Request](#example-2---post-request)
  - [Resources](#resources)

<br/>

Oracles take data from the outside world and put it into the blockchain for other smart contracts to consume.
This is a hardhat project containing contracts and scripts for `Chainlink` and `Witnet` integrations.

## Install

```typescript
npm install -g @klaytn-developer-sdk/kds-cli --force
```

## Quick Usage
For a default set of contracts and tests, run the following within the required project directory:

```typescript
> kds-cli oracle init

> cd oracle-starter-kit
> npm install --force
```

Above commands downloads the `oracle-starter-kit` folder structure in the current project directory. 
Enter inside the generated folder and install the packages as mentioned

From there you can run hardhat commands to compile your contracts, deploy those contracts to 
the network and run their associated unit tests.

## Setup Hardhat configurations Baobab Klaytn network and variables
The default hardhat configurations can be modified in `helper-hardhat-config.json`
Default configurations of baobab network `1001` are already using [Klaytn vrf configurations](https://docs.chain.link/vrf/v2/subscription/supported-networks/).

### 1. Hardhat configurations
Hardhat configuration variables can be found in `helper-hardhat-config.json` in the root directory. Below is the configuration explaination for `1001` network.

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
  
### 2. Environment Variables
We will need to set environment variables by following below steps 
1. copy `.env.example` file and rename to `.env`
2. Modify environment variables. Below is the explaination of each variable
  * `BAOBAB_RPC_URL` - `String` https://api.baobab.klaytn.net:8651/ can be used. its the rpc url of blockchain.
  * `PRIVATE_KEY` - `String` This is private key from wallet, ie [MetaMask](https://metamask.io/). This is required for deploying contracts to public networks. 
  * `AUTO_FUND` - `Boolean` provide true, if needs to autofund
  * `VRF_SUBSCRIPTION_ID` - `integer` VRF Subscription id. Head over to [VRF Subscription Page](https://vrf.chain.link/klaytn-testnet) and create the new subscription.

> IMPORTANT: MAKE SURE YOU DON'T EXPOSE THE KEYS YOU PUT IN THIS `.env` FILE saved in the package node_modules. By that, I mean don't push them to a public repo, and please try to keep them keys you use in development not associated with any real funds. 

Don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

> Get some Baobab Testnet KLAY and LINK 
Go to the [Klaytn faucets](https://baobab.wallet.klaytn.foundation/faucet) to get some KLAY to configured private key account.
Head over to the [Chainlink faucets](https://faucets.chain.link/) and get some LINK to configured private key account. Please follow [the chainlink documentation](https://docs.chain.link/docs/acquire-link/) if unfamiliar. 

## Deploy contracts

You should now be all setup! You can run any method now! Since we configured the environment variables and hardhat configurations so you don't really need to pass any configurations.

To comple contracts
```
npx hardhat compile
```

To deploy all contracts
```
npx hardhat deploy --network baobab
```

To run tests
```
npm run test
```

## Interacting with Deployed Contracts

After deploying your contracts, the deployment output will give you the contract addresses as they are deployed.You can then use these contract addresses in conjunction with Hardhat tasks to perform operations on each contract.

### Chainlink Price Feeds
The Price Feeds consumer contract has one task, to read the latest price of a specified price feed contract

```bash
npx hardhat read-price-feed --contract <deployedContractAddress> --network baobab
```

#### Parameters
`deployedContractAddress` - Deployed Price feed consumer contract.

#### Returns
  * `price` - price

#### Example
```
  npx hardhat read-price-feed --contract 0x6883956A235f8b823d547575812B08F4a720D76A --network baobab

  // By default it returns LINK/KLAY price feed value. 1 LINK = 32.9 KLAY
  /*
    Price is: 32915338976573950000
  */
```

### Change Chainlink price feed address
The price feed address used while deployment can be changed using below method. 

```bash
npx hardhat change-price-feed --contract <deployedContractAddress> --pricefeedaddress <pricefeedAddress> --network baobab
```

#### Parameters
`deployedContractAddress` - Deployed Price feed consumer contract.
`pricefeedAddress` - pricefeed address. see [Klaytn Pricefeed Addresses](https://docs.chain.link/data-feeds/price-feeds/addresses/?network=klaytn) for reference.

#### Returns
  * `transaction hash` - `String` transaction hash

#### Example
```typescript
  // Change pricefeedaddress to WEMIX/USD 0x76Aa17dCda9E8529149E76e9ffaE4aD1C4AD701B price feed contract. 1 WEMIX = 0.8 USD
  npx hardhat change-price-feed --contract 0x6883956A235f8b823d547575812B08F4a720D76A --pricefeedaddress 0x76Aa17dCda9E8529149E76e9ffaE4aD1C4AD701B --network baobab
  /*
    Transaction Hash: 0x0741df94b257a29f73ff4b94d2f0d5cd91dae20f2bc9946dd00a954905d85936
  */

  npx hardhat read-price-feed --contract 0x6883956A235f8b823d547575812B08F4a720D76A --network baobab
  /*
    Price is: 800625678041836600
  */
```

### Chainlink Request & Receive Data
The APIConsumer contract has two tasks, one to request external data based on a set of parameters, and one to check to see what the result of the data request is. 
Currently fetches the volume24hour data from https://min-api.cryptocompare.com/data/pricemultifull?fsyms=KLAY&tsyms=USD.

#### Fund ChainLinkAPI contract
This chainLinkApiData contract needs to be funded with `link` tokens first.

```bash
npx hardhat fund-link --contract <deployedContractAddress> --network baobab
```

#### Parameters
`deployedContractAddress` - Deployed API consumer contract.

##### Returns
  * `transaction hash` - `String` transaction hash

> **WARNING**: `chainlink-plugin-fund-link` have not supported `baobab network`. You have to fund `link` tokens manually to the deployed chainLinkApiData contract. Get deployed contracts list using `console.log(OracleSDK.readDeployedContracts())` method.

#### Request ChainLinkAPI Data
Once the deployed chainlinkAPI contract it's funded with `link` tokens, you can request external data by passing in a number of parameters to the request-data task. 

```bash
npx hardhat request-data --contract <deployedContractAddress> --coinsymbol <coinsymbol> --coindecimals <coindecimals> --network baobab
```
##### Parameters
1. `deployedContractAddress` - Deployed API consumer contract.
2. `coinsymbol` - coinsymbol. see [Coin Symbols](https://min-api.cryptocompare.com) for reference.
3. `coindecimals` - coin supported decimals. Ex: 18 for KLAY

##### Returns
  * `transaction hash` - `String` transaction hash

##### Example
```typescript
  npx hardhat request-data --contract 0xddDC43f1ae46757C94Ec6dCDAa7E9b6738e0db0b --coinsymbol KLAY --coindecimals 18 --network baobab

  /*
    Transaction Hash: 0xe8f3d600a4789d16b0a0a9a739d67bbefcb088aebbc038687c4c9e7b1d56373a
  */
```
#### Request ChainLinkAPI Data
Once you have successfully made a request for external data, you can see the result via the read-data task. it retrives VOLUME24 from https://min-api.cryptocompare.com/data/pricemultifull?fsyms=KLAY&tsyms=USD from the contract

```bash
npx hardhat read-data --contract <deployedContractAddress> --network baobab
```

##### Parameters
1. `deployedContractAddress` - Deployed API consumer contract.

##### Returns
  * `data` - `String` Receives `volume24` data without decimals

##### Example
```typescript
  // Receives volume24 from RAW.KLAY.USD.VOLUME24HOUR in "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=KLAY&tsyms=USD" result without decimals
  npx hardhat read-data --contract 0xddDC43f1ae46757C94Ec6dCDAa7E9b6738e0db0b  --network baobab

  /*
    Data is: 76993244391264860000000000
  */
```

### Chainlink VRF Get a random number
The VRFConsumer contract has two tasks, one to request a random number, and one to read the result of the random number request.

#### Prerequisite
To start, go to [VRF Subscription Page](https://vrf.chain.link/klaytn-testnet) and create the new subscription. Save your subscription ID and put it in  `.env` file as `VRF_SUBSCRIPTION_ID`:

```bash
  VRF_SUBSCRIPTION_ID=subscription_id
```

Then, deploy your VRF V2 contract consumer(if its not deployed already with the subscription id) to the network with your recent subscription using subscription id as constructor argument.

```bash
npx hardhat deploy --network baobab
```

Finally, you need to go to your subscription page one more time and add the address of deployed contract as a new consumer (https://vrf.chain.link/klaytn-testnet/<subscriptionid>). Once that's done, you can perform a VRF request with the request-random-number task.
> **_NOTE:_**  Make sure to add LINK funds to the subscription from the chainlink UI screen:

#### Request Chainlink Random number

```bash
npx hardhat request-random-number --contract <deployedContractAddress> --numwords <randomNumbersCount> --network baobab
```

##### Parameters
`deployedContractAddress` - Deployed RandomNumberConsumer contract address
`randomNumbersCount` - `integer` No of random numbers to be generated

##### Returns
  * `transaction hash` - `String` Transaction hash

##### Example
```typescript
  npx hardhat request-random-number --contract 0x3AFb1Ce6B16EcB1e367cCC23d99Ea4D9Ef497BE3 --numwords 3 --network baobab
  /*
    Transaction Hash: 0x770892fb09f00fbc25aa4118c4e59bae8f106e550d9295ddab62db79d708821a
  */
```

#### Read Chainlink Random number
Once you have successfully made a request for a random number, you can see the result via the read-random-number task:

```bash
  npx hardhat read-random-number --contract <deployedContactAddress> --network baobab
```

##### Parameters
`deployedContractAddress` - Deployed RandomNumberConsumer contract address

##### Returns
  * `randomNumbers` - random numbers

##### Example
```typescript
  npx hardhat read-random-number --contract 0x3AFb1Ce6B16EcB1e367cCC23d99Ea4D9Ef497BE3 --network baobab
  /*
    Random Numbers are: 25039093979060057973217505519617231457599792522931877947740225763662111327605,66221833599132925893563674221180186695699650058371972286077266023247996014608,62169596737219453842215058746401741770368274717351892705020984286494216685598
  */
```

### Chainlink Keepers
<!-- The KeepersCounter contract is a simple Chainlink Keepers enabled contract that simply maintains a counter variable that gets incremented each time the performUpkeep task is performed by a Chainlink Keeper. Once the contract is deployed, you should head to [https://keepers.chain.link/](https://keepers.chain.link/) to register it for upkeeps, then you can use the task below to view the counter variable that gets incremented by Chainlink Keepers


```bash
  npx hardhat read-keepers-counter --contract <deployedContractAddress>
``` 

##### Parameters
`deployedContractAddress` - Deployed KeepersCounter contract address

-->
> **WARNING**:
The Baobab network is not supported by Chainlink Automation (aka Chainlink Keepers) yet. Because of that, the response of the Keeper will always be 0. You can ignore this feature in the current version.

<br/>

### Witnet Price Feeds
The Witnet Price Feeds consumer contract has one task, to read the latest price of a specified price feed contract

```bash
  npx hardhat read-witnet-price-feed --contract <deployedContractAddress> --id <id> --network baobab
```

#### Parameters
`deployedContractAddress` - Deployed WitnetPriceFeed contract address
`id` - `string` id4 is the witnet pricefeed ID. Ex: `0x6cc828d1` for Price-KLAY/USD-6. See [Klaytn Witnet PriceFeeds](https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses/klaytn-price-feeds#klaytn-baobab) for reference.

#### Returns
  * `price` - price of KLAY/USD. 

#### Example
```typescript
  // 1 KLAY = 0.20 USD
  npx hardhat read-witnet-price-feed --contract 0x37291E5036db32DFe714823dE7A96253676e6487 --id 0x6cc828d1 --network baobab

  /*
    Last price is: 209744
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
  npx hardhat request-witnet-randomness --contract <deployedContractAddress> --network baobab
```

#### Parameters
`deployedContractAddress` - Deployed Deployed Witnet RandomNumber contract address

##### Returns
  * `transaction hash` - Transaction hash

##### Example
```typescript
  npx hardhat request-witnet-randomness --contract 0x8937C127F3060fF8a23E9a0fb5AEA10bc30e28be --network baobab
  /*
    Transaction Hash: 0x809addb235dc953c90a563c396c11978a359b574336564c7ec890514c961e050
  */
```

#### 2. Fetch Witnet random number
Initiate fetch witnet random number transaction.

> **WARNING**:
Calling `fetch-witnet-random-number` right after `request-witnet-randomness` will most likely cause the transaction to revert. Please allow 5-10 minutes for the randomization request to complete

```bash
  npx hardhat fetch-witnet-random-number --contract <deployedContractAddress> --network baobab
```

#### Parameters
`deployedContractAddress` - Deployed Witnet RandomNumber contract address

##### Returns
  * `transaction hash` - Transaction hash

##### Example
```typescript
  npx hardhat fetch-witnet-random-number --contract 0x8937C127F3060fF8a23E9a0fb5AEA10bc30e28be --network baobab
  /*
    Transaction Hash: 0x0eb8fe1217ecdc3860009bc49f5319cab6ffdedd80877c39df02899a3542db24'
  */
```

#### 3. Get the latest randomizing block
```bash
  npx hardhat read-latest-randomizing-block --contract <deployedContractAddress> --network baobab
```

#### Parameters
`deployedContractAddress` - Deployed Witnet RandomNumber contract address

##### Returns
  * `randomizingBlock` - randomized block value

##### Example
```typescript
  npx hardhat read-latest-randomizing-block --contract 0x8937C127F3060fF8a23E9a0fb5AEA10bc30e28be --network baobab
  /*
    The latest randomizing block is: 113690138
  */
```


#### 4. Get the generated random number
fetches the generated random number

> **_NOTE:_** Make sure first 2 steps are executed sequentially.

```bash
  npx hardhat read-witnet-random-number --contract <deployedContractAddress> --network baobab
```

#### Parameters
`deployedContractAddress` - Deployed Witnet RandomNumber contract address

##### Returns
  * `randomNumber` - generated random number

##### Example
```typescript
  npx hardhat read-witnet-random-number --contract 0x8937C127F3060fF8a23E9a0fb5AEA10bc30e28be --network baobab
  /*
    Random Number is: 1392104028
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
npx rad2sol --target ./witnet-queries --write-contracts ./contracts/witnet-requests
```

##### Example
```
  npx rad2sol --target ./witnet-queries --write-contracts ./contracts/witnet-requests
```

#### Execute Witnet Queries
After the contracts have been created, you can query locally to preview the result by running:
```
npx witnet-toolkit try-query --from-solidity ./contracts/witnet-requests/<contractFileName>
```

##### Parameters
`contractFileName` - `String` generatedSolFileName

##### Returns
  * `Result` - `string`

##### Example 1 - Fetch Coinprice
```typescript
  // 1 KLAY = 0.19 USD. Divide the return value by 10^6 to get actual coin price result.
  npx witnet-toolkit try-query --from-solidity ./contracts/witnet-requests/coinPrice.sol
  /*
    Result: 195467
  */
```

##### Example 2 - Post Request
```typescript
  // Gets parsed data of headers.Header-Name from the post api 
  npx witnet-toolkit try-query --from-solidity ./contracts/witnet-requests/postAPI.sol
  /*
    Result: "Header-Value"
  */
```

> **_NOTE:_**  If above tryWitnetQueries is stuck, please try to run command shown in below snapshot `npx witnet-toolkit`, install the binary once in the machine and retry above method
![WitnetToolkitBinary](./WitnetToolkitBinary.png)

## Resources

- [Chainlink Documentation](https://docs.chain.link/)
- [Witnet Documentation](https://docs.witnet.io/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)