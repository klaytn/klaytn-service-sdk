
![Logo](./KlaytnLogo.png)
- [Klaytn Developer SDK](#klaytn-developer-sdk)
  - [Oracles Module](#oracles-module)
    - [Chainlink](#chainlink)
    - [Witnet](#witnet)
  - [Bridges Module](#bridges-module)
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
- [Chainlink Data Feeds on Klaytn](/packages/oracles-starter-kit/README.md)
- [Chainlink VRF on Klaytn](/packages/oracles-starter-kit/README.md)
- [Chainlink Keepers on Klaytn](/packages/oracles-starter-kit/README.md)
- [Request & Receive data on Klaytn](/packages/oracles-starter-kit/README.md)

### Witnet
- [Witnet Data Feeds on Klaytn](/packages/oracles-starter-kit/README.md)
- [Witnet Randomness on Klaytn](/packages/oracles-starter-kit/README.md)

## Bridges Module
`In progress`

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

## Want to Contribute to Klaytn Developer SDK? <a id="want-to-contribute"></a>

In line with our commitment to decentralization, all Klaytn codebase and its documentations are completely open source. Klaytn always welcomes your contribution. Anyone can view, edit, fix its contents and make suggestions. You can either create a pull request on GitHub or create a enhancement request. Make sure to check our [Contributor License Agreement (CLA)](https://gist.github.com/e78f99e1c527225637e269cff1bc7e49) first and there are also a few guidelines our contributors would check out before contributing:

- [Contribution Guide](./CONTRIBUTING.md)
- [License](./LICENSE)