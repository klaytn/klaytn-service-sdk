# Oracle Starter Kit
- [Oracle Starter Kit](#oracle-starter-kit)
  - [Usage](#usage)
  - [Setup Hardhat configurations Baobab Klaytn network and variables](#setup-hardhat-configurations-baobab-klaytn-network-and-variables)
  - [Interacting with Deployed Contracts](#interacting-with-deployed-contracts)
    - [Chainlink Price Feeds](#chainlink-price-feeds)
    - [Chainlink Request \& Receive Data](#chainlink-request--receive-data)
    - [Chainlink VRF Get a random number](#chainlink-vrf-get-a-random-number)
    - [Chainlink Keepers](#chainlink-keepers)
    - [Witnet Price Feeds](#witnet-price-feeds)
    - [Witnet Randomness](#witnet-randomness)
  - [Witnet Web Oracle Request](#witnet-web-oracle-request)
  - [Resources](#resources)

<br/>

## Usage
```
const OracleSDK = require("@klaytn-developer-sdk/oracles-starter-kit");
```

## Setup Hardhat configurations Baobab Klaytn network and variables
Use `console.log(OracleSDK.getBaobabHardhatConfigurations())` to get the configurations.
Default configurations are already using Klaytn vrf configurations. These details can be found https://docs.chain.link/vrf/v2/subscription/supported-networks/ .

Modify and execute below method to change the Hardhat configurations
```
Default Configurations are as shown below:
OracleSDK.setBaobabHardhatConfigurations({
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
  })
```
This command will modify the `helper-hardhat-config.json` in the package node_modules.

First, we will need to set environment variables. We can do so by using below commands.

Use `console.log(OracleSDK.getVariables())` to fetch the environment variables. This are retrieved from .env file of package in node_modules.

Use below command to set the environment variables. Explaination of each variable can be found below.
```
OracleSDK.setVariables({
    BAOBAB_RPC_URL: 'https://api.baobab.klaytn.net:8651', 
    PRIVATE_KEY: 'Private key here', 
    AUTO_FUND: true, 
    VRF_SUBSCRIPTION_ID: <vrf subscription id>
})
```

> IMPORTANT: MAKE SURE YOU DON'T EXPOSE THE KEYS YOU PUT IN THIS `.env` FILE. By that, I mean don't push them to a public repo, and please try to keep them keys you use in development not associated with any real funds. 

1. Set your `BAOBAB_RPC_URL` [environment variable.](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html)

You can use this https://api.baobab.klaytn.net:8651/. This is your connection to the blockchain. 

2. Set your `PRIVATE_KEY` environment variable. 

This is your private key from your wallet, ie [MetaMask](https://metamask.io/). This is needed for deploying contracts to public networks. 

![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+) **WARNING** ![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+)

When developing, it's best practice to use a Metamask that isn't associated with any real money. A good way to do this is to make a new browser profile (on Chrome, Brave, Firefox, etc) and install Metamask on that browser, and never send this wallet money.  

Don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

For mainnet, you can use different environment variables for your RPC URL and your private key. See the `hardhat.config.js` to learn more. 

1. Get some Baobab Testnet KLAY and LINK 
Go to the [Klaytn faucets](https://baobab.wallet.klaytn.foundation/faucet) to get some KLAY to configured private key account.
Head over to the [Chainlink faucets](https://faucets.chain.link/) and get some LINK to configured private key account. Please follow [the chainlink documentation](https://docs.chain.link/docs/acquire-link/) if unfamiliar. 

1. Create VRF V2 subscription

Head over to [VRF Subscription Page](https://vrf.chain.link/klaytn-testnet) and create the new subscription. Save your subscription ID and put it in environment variables as `VRF_SUBSCRIPTION_ID` with the help of `setVariables` function along with `PRIVATE_KEY`

1. Running methods

You should now be all setup! You can run any method now! Since we configured the environment variables and hardhat configurations so you don't really need to pass that argument for sort.

To deploy contracts:

```
OracleSDK.deployAll().then(result => console.log(result))
```

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

To fetch the deployed contracts:
```
console.log(OracleSDK.readDeployedContracts())
```
### Chainlink Price Feeds
The Price Feeds consumer contract has one task, to read the latest price of a specified price feed contract

```bash
OracleSDK.readChainLinkPriceFeed().then(result => console.log(result))
```

### Chainlink Request & Receive Data
The APIConsumer contract has two tasks, one to request external data based on a set of parameters, and one to check to see what the result of the data request is. This chainLinkApiData contract needs to be funded with link first:

```bash
fundChainLinkApiData().then(result => console.log(result))
```
> **WARNING**: `chainlink-plugin-fund-link` have not supported `baobab network`. You have to fund link manually to the deployed chainLinkApiData contract. Get deployed contracts list using `console.log(OracleSDK.readDeployedContracts())` method.

Once it's funded, you can request external data by passing in a number of parameters to the request-data task. The contract parameter is mandatory, the rest are optional

```bash
OracleSDK.requestChainLinkApiData().then(result => console.log(result))
```

Once you have successfully made a request for external data, you can see the result via the read-data task. it retrives VOLUME24 from https://min-api.cryptocompare.com/data/pricemultifull?fsyms=KLAY&tsyms=USD from the contract
```bash
OracleSDK.readChainLinkApiData().then(result => console.log(result));
```

### Chainlink VRF Get a random number
The VRFConsumer contract has two tasks, one to request a random number, and one to read the result of the random number request. To start, go to [VRF Subscription Page](https://vrf.chain.link/klaytn-testnet) and create the new subscription. Save your subscription ID and put it in environment variables as `VRF_SUBSCRIPTION_ID` using `setVariables` method:

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
Make sure to add LINK funds to the subscription from the chainlink UI screen:

```bash
OracleSDK.requestChainLinkRandomNumber().then(result => console.log(result))
```

Once you have successfully made a request for a random number, you can see the result via the read-random-number task:

```bash
OracleSDK.readChainLinkRandomNumber().then(result => console.log(result));
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
OracleSDK.readWitnetPriceFeed().then(result => console.log(result));
```

### Witnet Randomness
The Witnet Randomness has 4 tasks:
- Request new randomness:
```bash
OracleSDK.requestWitnetRandomNumber().then(result => console.log(result));
```
- Get the latest randomizing block:
```bash
OracleSDK.readWitnetLatestRandomizingBlock().then(result => console.log(result))
```
- Fetch Witnet random number:
```bash
OracleSDK.fetchWitnetRandomNumber().then(result => console.log(result))
```
> **WARNING**:
Calling fetch-witnet-random-number right after request-witnet-randomness will most likely cause the transaction to revert. Please allow 5-10 minutes for the randomization request to complete
- Get the random number:
```bash
OracleSDK.readWitnetRandomNumber().then(result => console.log(result));
```

## Witnet Web Oracle Request
We have 2 examples for Witnet HTTP Request:
- KlayPrice: a GET request example to get Klay token price in USD
- postRequestExample: a POST request example echoes back any data and headers that you send in your POST requests (based on this [tutorial](https://docs.witnet.io/smart-contracts/witnet-web-oracle/make-a-post-request))

Inside `witnet-queries` folder you will find predefined Witnet oracle queries.

You can follow this [link](https://docs.witnet.io/smart-contracts/witnet-web-oracle/make-a-get-request) to learn how to create other queries.

To compile the Witnet queries into Solidity contracts, run:
```
OracleSDK.compileWitnetQueriesToSolidityContracts().then(result => console.log(result))
```

To fetch the compiled contract filenames, run:
```
console.log(OracleSDK.getCompiledWitnetQueriesSolFiles());
```

After the contracts have been created, you can query locally to preview the result by running:
```
OracleSDK.tryWitnetQueries(<CompiledSolFileName>).then(result => console.log(result))
Example: OracleSDK.tryWitnetQueries("klayPrice.sol").then(result => console.log(result))
```
If above tryWitnetQueries is stuck, please try to run command shown in below snapshot, install the binary and retry above method
![WitnetToolkitBinary](./WitnetToolkitBinary.png)

## Resources

- [Chainlink Documentation](https://docs.chain.link/)
- [Witnet Documentation](https://docs.witnet.io/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)