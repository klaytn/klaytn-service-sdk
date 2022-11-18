# Klaytn cBridge starter kit

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
## 1. Transfer
To transfer funds from one chain (source chain) to another chain (destination chain) please perform the following steps:
1. Make sure .env is updated
2. Run following command
```sh
npm run test-transfer
```

### 1.2. Refund Transfer
To refund failed transfer funds, please perform the following steps:
1. Make sure transferId is updated in `examples/poolTransferFlowRefund.ts`
   2. you can get `transferId` from logs of **Transfer**
2. Run following command
```sh
npm run transfer-refund
```

## 2. Mint
To mint tokens from source chain to destination chain, please perform the following steps:
1. Make sure .env is updated with relevant information
2. Run following command
```sh
npm run test-mint
```

### 2.1. Mint Refund
To refund failed mint tokens, please perform the following steps:
1. Make sure `depositId` is updated in `examples/mintCanonicalTokenRefund.ts`
    2. you can get `depositId` from logs of **Mint**
2. Run following command
```sh
npm run mint-refund
```

## 3. Burn
To burn / withdraw tokens from source chain (the chain on where you want to burn/withdraw your tokens) to destination chain (the chain on where you want to receive your burnt tokens), please perform the following steps:
1. Make sure .env is updated with relevant information
2. Run following command
```sh
npm run test-burn
```

### 3.1. Burn Refund
To refund failed burn tokens, please perform the following steps:
1. Make sure `burnId` is updated in `examples/burnCanonicalTokenRefund.ts`
    2. you can get `burnId` from logs of **Burn**
2. Run following command
```sh
npm run burn-refund
```

## Reference Docs:

- https://cbridge-docs.celer.network/developer/cbridge-sdk
- https://github.com/celer-network/cBridge-typescript-client
- https://test-cbridge-v2.celer.network/
- https://cbridge.celer.network/1/10/USDC
