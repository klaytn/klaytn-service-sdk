# Klaytn wormhole starter kit
- [Klaytn wormhole starter kit](#klaytn-wormhole-starter-kit)
  - [About](#about)
  - [Folder Structure](#folder-structure)
  - [Setup](#setup)
  - [Quick Start](#quick-start)
  - [1.Token Attestation](#1token-attestation)
  - [2.Transfer Native coins](#2transfer-native-coins)
  - [3.Transfer Tokens](#3transfer-tokens)
  - [Reference Docs:](#reference-docs)

## About
Wormhole is a communication bridge between Klaytn and other top decentralized finance (DeFi) networks. Existing projects, platforms, and communities are able to move tokenized assets seamlessly across blockchains and benefit from Klaytn's high speed and low cost.

## Folder Structure

- [examples](./examples): Ready-to-run code examples to call the Wormhole Rest APIs.

## Setup
Rename `.env.example to .env` and Set variables in `.env`
Configure private key in .env

## Quick Start
You can run the below commands to test
## 1.Token Attestation
To attest a token of one chain (source chain) to another chain (destination chain) please perform the following steps:
1. Make sure .env is updated
2. Change source token in examples/attest.ts file and any other addresses if necessary
3. Run following command
```sh
npm run test-attest
```

## 2.Transfer Native coins
To transfer native coins from source chain to destination chain between evm compatible chains, please perform the following steps:
1. Make sure .env is updated with relevant information
2. Change source, destination variables related to the token transfer in examples/transferBasic.ts if necessary
3. Make sure IS_NATIVE=true in examples/transferBasic.ts
4. Run following command
```sh
npm run test-transfer-basic
```

## 3.Transfer Tokens
To transfer tokens from source chain to destination chain between evm compatible chains, please perform the following steps:
1. Make sure .env is updated with relevant information
2. Update source, destination variables related to the token transfer in examples/transferBasic.ts if necessary
3. Make sure IS_NATIVE=false in examples/transferBasic.ts
4. Run following command
```sh
npm run test-transfer-basic
```

## Reference Docs:

- https://www.npmjs.com/package/@certusone/wormhole-sdk
- https://book.wormhole.com/technical/typescript/attestingToken.html
- https://wormhole-foundation.github.io/example-token-bridge-ui/#/transfer (Testnet Website URL)
- https://www.portalbridge.com/#/transfer (Mainnet Website URL)