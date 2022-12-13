
![Logo](./KlaytnLogo.png)
- [Klaytn Developer SDK](#klaytn-developer-sdk)
  - [Oracles Module](#oracles-module)
    - [Chainlink](#chainlink)
    - [Witnet](#witnet)
  - [Bridges Module](#bridges-module)
    - [Celer Bridge](#celer-bridge)
    - [Wormhole Bridge](#wormhole-bridge)
- [Getting started](#getting-started)
    - [Requirement](#requirement)
    - [Quickstart](#quickstart)
- [Usage](#usage)

<br/>

# Klaytn Developer SDK
<p style="font-size:x-large">Klaytn Developer SDK is a monorepo of all the ecosystem tools. It has all the packages necessary to build on Klaytn ecosystem</p>

## Oracles Module
### Chainlink
Implementation of the following 4 Chainlink features using the [Hardhat](https://hardhat.org/) development environment:
- [Chainlink Data Feeds on Klaytn](/packages/oracles-starter-kit/README.md#chainlink-price-feeds)
- [Chainlink VRF on Klaytn](/packages/oracles-starter-kit/README.md#chainlink-vrf-get-a-random-number)
- [Chainlink Keepers on Klaytn](/packages/oracles-starter-kit/README.md#chainlink-keepers)
- [Request & Receive data on Klaytn](/packages/oracles-starter-kit/README.md#chainlink-request--receive-data)

### Witnet
- [Witnet Data Feeds on Klaytn](/packages/oracles-starter-kit/README.md#witnet-price-feeds)
- [Witnet Randomness on Klaytn](/packages/oracles-starter-kit/README.md#witnet-randomness)


## Bridges Module
### Celer Bridge
Implementations:
- [PoolBased Transfer](/packages/bridges-starter-kit/celer/README.md#1poolbased-transfer)
- [PoolBased Transfer Refund](/packages/bridges-starter-kit/celer/README.md#12poolbased-transfer-refund)
- [MintCanoncialToken](/packages/bridges-starter-kit/celer/README.md#2mint-canonical-token)
- [MintCanoncialToken Refund](/packages/bridges-starter-kit/celer/README.md#21mint-canoncial-token-refund)
- [BurnCanoncialToken](/packages/bridges-starter-kit/celer/README.md#3burn-canonical-token)
- [BurnCanoncialToken Refund](/packages/bridges-starter-kit/celer/README.md#31burn-canoncial-token-refund)
<<<<<<< HEAD
<br/>

### Wormhole Bridge
Implementations:
- [Token Attestation](/packages/bridges-starter-kit/wormhole/README.md#1token-attestation)
- [Transfer Native Coins](/packages/bridges-starter-kit/wormhole/README.md#2transfer-native-coins)
- [Transfer Tokens](/packages/bridges-starter-kit/wormhole/README.md#3transfer-tokens)
=======
>>>>>>> main
<br/>

# Getting started
### Requirement
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
```bash
git clone https://github.com/klaytn/klaytn-developer-sdk
cd klaytn-developer-sdk
```
then
```bash
yarn
```

or
```bash
npm i
```

<br/>

# Usage
You can run the scripts in root or in respective packages by `cd` into the packages. 