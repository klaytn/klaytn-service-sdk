[Open in Github](https://github.com/klaytn/klaytn-developer-sdk)
- [Klaytn Developer SDK](#klaytn-developer-sdk)
  - [Oracles Module](#oracles-module)
    - [Chainlink](#chainlink)
    - [Witnet](#witnet)
  - [Bridges Module](#bridges-module)
- [Getting Started](#getting-started)
  - [Requirement](#requirement)
  - [Quickstart](#quickstart)
- [Usage](#usage)

<br/>

# Klaytn Developer SDK
<p style="font-size:x-large">All the necessary tools in one place to build on Klaytn ecosystem</p>

## Oracles Module
### Chainlink
Implementation of the following 4 Chainlink features using the [Hardhat](https://hardhat.org/) development environment:
- [Chainlink Data Feeds](https://docs.chain.link/docs/using-chainlink-reference-contracts)
- [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf)
- [Chainlink Keepers](https://docs.chain.link/docs/chainlink-keepers/introduction/)
- [Request & Receive data](https://docs.chain.link/docs/request-and-receive-data)

### Witnet
`In process`

## Bridges Module
`In process`

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
You can freely run script in root or in packages by `cd` into the package you want to use