## Chainlink Module
- [Usage](#usage)
  - [Deploying Contracts](#deploying-contracts)
  - [Setup Baobab Klaytn network](#setup-baobab-klaytn-network)
- [Interacting with Deployed Contracts](#interacting-with-deployed-contracts)
  - [Chainlink Price Feeds](#chainlink-price-feeds)
  - [Request & Receive Data](#request--receive-data)
  - [VRF Get a random number](#vrf-get-a-random-number)
  - [Keepers](#keepers)
- [Resources](#resources)

<br/>

## Usage
If you run `yarn hardhat --help` you'll get an output of all the tasks you can run. Please setup the Baobab network before running any task. 

### Setup Baobab Klaytn network
In your `hardhat.config.js` you'll see section like:

```
module.exports = {
  defaultNetwork: "baobab",
  networks: {
```

This section of the file is where you define which networks you want to interact with. You can read more about that whole file in the [hardhat documentation.](https://hardhat.org/config/)

First, we will need to set environment variables. We can do so by setting them in our `.env` file inside `packages/oracles-starter-kit/chainlink` (create it if it's not there). You can also read more about [environment variables](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html) from the linked twilio blog. You'll find a sample of what this file will look like in `.env.example`

> IMPORTANT: MAKE SURE YOU'D DON'T EXPOSE THE KEYS YOU PUT IN THIS `.env` FILE. By that, I mean don't push them to a public repo, and please try to keep them keys you use in development not associated with any real funds. 

1. Set your `BAOBAB_RPC_URL` [environment variable.](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html)

You can use this https://api.baobab.klaytn.net:8651/. This is your connection to the blockchain. 

2. Set your `PRIVATE_KEY` environment variable. 

This is your private key from your wallet, ie [MetaMask](https://metamask.io/). This is needed for deploying contracts to public networks. You can optionally set your `MNEMONIC` environment variable instead with some changes to the `hardhat.config.js`.

![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+) **WARNING** ![WARNING](https://via.placeholder.com/15/f03c15/000000?text=+)

When developing, it's best practice to use a Metamask that isn't associated with any real money. A good way to do this is to make a new browser profile (on Chrome, Brave, Firefox, etc) and install Metamask on that browser, and never send this wallet money.  

Don't commit and push any changes to .env files that may contain sensitive information, such as a private key! If this information reaches a public GitHub repository, someone can use it to check if you have any Mainnet funds in that wallet address, and steal them!

`.env` example:
```
BAOBAB_RPC_URL='https://api.baobab.klaytn.net:8651/'
PRIVATE_KEY='abcdef'
```
`bash` example
```
export BAOBAB_RPC_URL='https://api.baobab.klaytn.net:8651/'
export PRIVATE_KEY='abcdef'
```

> You can also use a `MNEMONIC` instead of a `PRIVATE_KEY` environment variable by uncommenting the section in the `hardhat.config.js`, and commenting out the `PRIVATE_KEY` line. However this is not recommended. 

For mainnet, you can use different environment variables for your RPC URL and your private key. See the `hardhat.config.js` to learn more. 

3. Get some Baobab Testnet KLAY and LINK 
Go to the [Klaytn faucets](https://baobab.wallet.klaytn.foundation/faucet) to get some KLAY.
Head over to the [Chainlink faucets](https://faucets.chain.link/) and get some LINK. Please follow [the chainlink documentation](https://docs.chain.link/docs/acquire-link/) if unfamiliar. 

4. Create VRF V2 subscription

Head over to [VRF Subscription Page](https://vrf.chain.link/klaytn-testnet) and create the new subscription. Save your subscription ID and put it in `.env` file as `VRF_SUBSCRIPTION_ID`

5. Running commands

You should now be all setup! You can run any command and just pass the `--network baobab` now! Since we config default network is baobab so you don't really need to pass that argument for sort.

To deploy contracts:

```
yarn hardhat deploy --network baobab
```

To run tests
```
yarn hardhat test --network baobab
```

## Interacting with Deployed Contracts

After deploying your contracts, the deployment output will give you the contract addresses as they are deployed. You can then use these contract addresses in conjunction with Hardhat tasks to perform operations on each contract.

### Chainlink Price Feeds
The Price Feeds consumer contract has one task, to read the latest price of a specified price feed contract

```bash
yarn hardhat read-price-feed --contract insert-contract-address-here --network baobab
```

### Request & Receive Data
The APIConsumer contract has two tasks, one to request external data based on a set of parameters, and one to check to see what the result of the data request is. This contract needs to be funded with link first:

```bash
yarn hardhat fund-link --contract insert-contract-address-here --network baobab
```
> **WARNING**: `chainlink-plugin-fund-link` have not supported `baobab network`. You have to fund link manually

Once it's funded, you can request external data by passing in a number of parameters to the request-data task. The contract parameter is mandatory, the rest are optional

```bash
yarn hardhat request-data --contract insert-contract-address-here
```

Once you have successfully made a request for external data, you can see the result via the read-data task
```bash
yarn hardhat read-data --contract insert-contract-address-here
```

### VRF Get a random number
The VRFConsumer contract has two tasks, one to request a random number, and one to read the result of the random number request. To start, go to [VRF Subscription Page](https://vrf.chain.link/goerli) and create the new subscription. Save your subscription ID and put it in `.env` file as `VRF_SUBSCRIPTION_ID`:

```bash
VRF_SUBSCRIPTION_ID=subscription_id
```

Then, deploy your VRF V2 contract consumer(if its not deployed already with the subscription id) to the network with your recent subscription using subscription id as constructor argument.

```bash
yarn hardhat deploy   
```

Finally, you need to go to your subscription page one more time and add the address of deployed contract as a new consumer. Once that's done, you can perform a VRF request with the request-random-number task:

```bash
yarn hardhat request-random-number --contract insert-contract-address-here
```

Once you have successfully made a request for a random number, you can see the result via the read-random-number task:

```bash
yarn hardhat read-random-number --contract insert-contract-address-here
```

### Keepers
The KeepersCounter contract is a simple Chainlink Keepers enabled contract that simply maintains a counter variable that gets incremented each time the performUpkeep task is performed by a Chainlink Keeper. Once the contract is deployed, you should head to [https://keepers.chain.link/](https://keepers.chain.link/) to register it for upkeeps, then you can use the task below to view the counter variable that gets incremented by Chainlink Keepers


```bash
yarn hardhat read-keepers-counter --contract insert-contract-address-here
```

## Resources

- [Chainlink Documentation](https://docs.chain.link/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)