# Klaytn Developer SDK
## Chainlink
- [Klaytn Developer SDK](#klaytn-developer-sdk)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Quickstart](#quickstart)
- [Usage](#usage)
  - [Deploying Contracts](#deploying-contracts)
  - [Using a Testnet or Live Network](#using-a-testnet-or-live-network)
    - [Baobab Klaytn Testnet Setup](#baobab-klaytn-testnet-setup)
  - [Auto-Funding](#auto-funding)
- [Test](#test)
- [Interacting with Deployed Contracts](#interacting-with-deployed-contracts)
  - [Resources](#resources)

 Implementation of the following 4 Chainlink features using the [Hardhat](https://hardhat.org/) development environment:
 - [Chainlink Price Feeds](https://docs.chain.link/docs/using-chainlink-reference-contracts)
 - [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf)
 - [Chainlink Keepers](https://docs.chain.link/docs/chainlink-keepers/introduction/)
 - [Request & Receive data](https://docs.chain.link/docs/request-and-receive-data)

### Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version`and get an output like: `vx.x.x`
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` And get an output like: `x.x.x`
    - You might need to install it with npm

> If you're familiar with `npx` and `npm` instead of `yarn`, you can use `npx` for execution and `npm` for installing dependencies. 

### Quickstart

After installing all the requirements, run the following:

```
yarn
```

or
```
npm i
```

### Using a Testnet or Live Network
In your `hardhat.config.js` you'll see section like:

```
module.exports = {
  defaultNetwork: "baobab",
  networks: {
```

This section of the file is where you define which networks you want to interact with. You can read more about that whole file in the [hardhat documentation.](https://hardhat.org/config/)

To interact with a live or test network, you'll need:

1. An rpc URL 
2. A Private Key
3. ETH & LINK token (either testnet or real)

Let's look at an example of setting these up using the Baobab testnet. 

### Deploying Contracts
Run below command to compile contracts
```
yarn chainlink:deploy
```

```
yarn chainlink:deploy
```

This will deploy your contracts to a baobab network.

### Baobab Klaytn Testnet Setup

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

For other networks like mainnet and polygon, you can use different environment variables for your RPC URL and your private key. See the `hardhat.config.js` to learn more. 

3. Get some Baobab Testnet KLAY and LINK 
Go to the [Klaytn faucets](https://baobab.wallet.klaytn.foundation/faucet) to get some KLAY.
Head over to the [Chainlink faucets](https://faucets.chain.link/) and get some LINK. Please follow [the chainlink documentation](https://docs.chain.link/docs/acquire-link/) if unfamiliar. 

4. Create VRF V2 subscription

Head over to [VRF Subscription Page](https://vrf.chain.link/klaytn-testnet) and create the new subscription. Save your subscription ID and put it in `.env` file as `VRF_SUBSCRIPTION_ID`

5. Running commands

You should now be all setup! You can run any command and just pass the `--network baobab` now!

To deploy contracts:

```
yarn chainlink:deploy
```

To run tests
```
yarn chainlink:test
```

### Auto-Funding

This Starter Kit is configured by default to attempt to auto-fund any newly deployed contract that uses Any-API, to save having to manually fund them after each deployment. The amount in LINK to send as part of this process can be modified in the [Starter Kit Config](helper-hardhat-config.js), and are configurable per network.

| Parameter  | Description                                       | Default Value |
| ---------- | :------------------------------------------------ | :------------ |
| fundAmount | Amount of LINK to transfer when funding contracts | 0.1 LINK      |

If you wish to deploy the smart contracts without performing the auto-funding, add an `AUTO_FUND` environment variable, and set it to false. 

### Interacting with Deployed Contracts

After deploying your contracts, the deployment output will give you the contract addresses as they are deployed. You can then use these contract addresses in conjunction with Hardhat tasks to perform operations on each contract.

### RUNNING TASKS

If you run `yarn chainlink:help` you'll get an output of all the tasks you can run. 

### Resources

- [Chainlink Documentation](https://docs.chain.link/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
