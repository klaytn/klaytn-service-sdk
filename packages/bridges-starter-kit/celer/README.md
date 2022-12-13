# Klaytn cBridge starter kit
- [Klaytn cBridge starter kit](#klaytn-cbridge-starter-kit)
  - [About](#about)
  - [Folder Structure](#folder-structure)
  - [Setup](#setup)
  - [Quick Start](#quick-start)
  - [1.PoolBased Transfer](#1poolbased-transfer)
    - [1.2.PoolBased Transfer Refund](#12poolbased-transfer-refund)
  - [2.Mint Canonical Token](#2mint-canonical-token)
    - [2.1.Mint Canoncial Token Refund](#21mint-canoncial-token-refund)
  - [3.Burn Canonical Token](#3burn-canonical-token)
    - [3.1.Burn Canoncial Token Refund](#31burn-canoncial-token-refund)
  - [Reference Docs:](#reference-docs)

## About
cBridge provides a simple liquidity provider experience and high liquidity efficiency for users when they manage their funds in different
chains with lower costs. Learn more about flow and terminology from this doc:
[cBridge requirements](https://docs.google.com/document/d/15gVJfiAjzfR9dyz_ad7jQOx5PSPI6p_RanLA6XRLCYU/edit?usp=sharing)

## Folder Structure

- [examples](./examples): Ready-to-run code examples to call the cBridge gateway via the REST API.
- [contract](./contract): Generated cBridge contract ABIs and bindings.
- [proto](./proto): gRPC-Web Protobuf definitions.
- [ts-proto](./ts-proto): Generated .d.ts gRPC-Web bindings.

## Setup
Rename `.env.example to .env` and Set variables in `.env`

## Quick Start
You can run the below commands to test
## 1.PoolBased Transfer
To transfer funds from one chain (source chain) to another chain (destination chain) please perform the following steps:
1. Make sure .env is updated
2. Run following command
```sh
npm run test-transfer
```

### 1.2.PoolBased Transfer Refund
To refund failed transfer funds, please perform the following steps:
1. Make sure transferId is updated in `examples/poolTransferFlowRefund.ts`
   1.1. you can get `transferId` from logs of **Transfer**
2. Run following command
```sh
npm run test-transfer-refund
```

## 2.Mint Canonical Token
To mint tokens from source chain to destination chain, please perform the following steps:
1. Make sure .env is updated with relevant information
2. Run following command
```sh
npm run test-mint
```

### 2.1.Mint Canoncial Token Refund
To refund failed mint tokens, please perform the following steps:
1. Make sure `depositId` is updated in `examples/mintCanonicalTokenRefund.ts`
    1.1. you can get `depositId` from logs of **Mint**
2. Run following command
```sh
npm run test-mint-refund
```

## 3.Burn Canonical Token
To burn / withdraw tokens from source chain (the chain on where you want to burn/withdraw your tokens) to destination chain (the chain on where you want to receive your burnt tokens), please perform the following steps:
1. Make sure .env is updated with relevant information
2. Run following command
```sh
npm run test-burn
```

### 3.1.Burn Canoncial Token Refund
To refund failed burn tokens, please perform the following steps:
1. Make sure `burnId` is updated in `examples/burnCanonicalTokenRefund.ts`
    1.1. you can get `burnId` from logs of **Burn**
2. Run following command
```sh
npm run test-burn-refund
```

## Reference Docs:

- https://cbridge-docs.celer.network/developer/cbridge-sdk
- https://github.com/celer-network/cBridge-typescript-client
- https://test-cbridge-v2.celer.network/ (Testnet Website URL)
- https://cbridge.celer.network (Mainnet Website URL)