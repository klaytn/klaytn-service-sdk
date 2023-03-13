
![Logo](./KlaytnLogo.png)
- [Klaytn Developer SDK](#klaytn-developer-sdk)
  - [Oracles Module](#oracles-module)
    - [Witnet](#witnet)
  - [Bridges Module](#bridges-module)
    - [Celer Bridge](#celer-bridge)
    - [Wormhole Bridge](#wormhole-bridge)
  - [DEX Module](#dex-module)
    - [Open source DEX](#open-source-dex)
- [Getting started](#getting-started)
    - [Requirement](#requirement)
    - [Quickstart](#quickstart)
- [Usage](#usage)
  - [Want to Contribute to Klaytn Developer SDK? ](#want-to-contribute-to-klaytn-developer-sdk-)

<br/>

# Klaytn Developer SDK
<p style="font-size:x-large">Klaytn Developer SDK is a monorepo of all the ecosystem tools. It has all the packages necessary to build on Klaytn ecosystem</p>

## Oracles Module
### Witnet
Implementation of the following features using the [Hardhat](https://hardhat.org/) development environment:
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

### Wormhole Bridge
Implementations:
- [Token Attestation](/packages/bridges-starter-kit/wormhole/README.md#1token-attestation)
- [Transfer Tokens](/packages/bridges-starter-kit/wormhole/README.md#2transfer-tokens)

## DEX Module
### Open source DEX
Integration of the following 5 DEX contracts:
- [Swap](/packages/dexs-starter-kit/core/Swap.ts)
- [Liquidity](/packages/dexs-starter-kit/core/Liquidity.ts)
- [Farming](/packages/dexs-starter-kit/core/Farming.ts)
- [Staking](/packages/dexs-starter-kit/core/Staking.ts)

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

## Want to Contribute to Klaytn Developer SDK? <a id="want-to-contribute"></a>

In line with our commitment to decentralization, all Klaytn codebase and its documentations are completely open source. Klaytn always welcomes your contribution. Anyone can view, edit, fix its contents and make suggestions. You can either create a pull request on GitHub or create a enhancement request. Make sure to check our [Contributor License Agreement (CLA)](https://gist.github.com/e78f99e1c527225637e269cff1bc7e49) first and there are also a few guidelines our contributors would check out before contributing:

- [Contribution Guide](./CONTRIBUTING.md)
- [License](./LICENSE)
- [Code of Conducts](./code-of-conduct.md)
