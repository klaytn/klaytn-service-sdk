# Klaytn wormhole starter kit
- [Klaytn wormhole starter kit](#klaytn-wormhole-starter-kit)
  - [About](#about)
  - [Folder Structure](#folder-structure)
  - [Setup](#setup)
  - [Quick Start](#quick-start)
  - [1.Token Attestation](#1token-attestation)
  - [2.Transfer Tokens](#2transfer-tokens)
  - [Reference Docs:](#reference-docs)

## About
Wormhole is a communication bridge between Klaytn and other top decentralized finance (DeFi) networks. Existing projects, platforms, and communities are able to move tokenized assets seamlessly across blockchains and benefit from Klaytn's high speed and low cost.

## Folder Structure

- [core](./core): it includes @wormhole-sdk and the contracts ABIs
- [use-cases](./use-cases): Ready-to-run code of some use-cases to call the Wormhole Rest APIs.

## Setup
2. `yarn install`

## Quick Start
You can run following ready-made use-cases to test
## 1.Token Attestation
To attest a token of one chain (source chain) to another chain (destination chain) for EVM compatible chains, please perform the following steps:
1. Make sure are required params are provided. Below table explains the variables required for attestation process. 

| Variable        | Description           | Example  | References |
| ------------- | ------------- | ------------- | ------------- |
| WORMHOLE_REST_URL | wormhole rest api | https://wormhole-v2-testnet-api.certus.one | [https://book.wormhole.com/reference/rpcnodes.html](https://book.wormhole.com/reference/rpcnodes.html) |
| SOURCE_PRIVATE_KEY | source chain private key containing base curreny required for performing transactions | Private key here | |
| SOURCE_RPC_URL | source chain rpc url      | https://api.baobab.klaytn.net:8651 |
| SOURCE_CORE_BRIDGE | source chain core bridge address      | 0x1830CC6eE66c84D2F177B94D544967c774E624cA | [https://book.wormhole.com/reference/contracts.html#core-bridge-1](https://book.wormhole.com/reference/contracts.html#core-bridge-1) |
| SOURCE_TOKEN_BRIDGE | source chain token bridge address      | 0xC7A13BE098720840dEa132D860fDfa030884b09A | [https://book.wormhole.com/reference/contracts.html#token-bridge-1](https://book.wormhole.com/reference/contracts.html#token-bridge-1) |
| SOURCE_WORMHOLE_CHAIN_ID | source chain wormhole chainName      | 13 | [https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts](https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts) |
| DESTINATION_PRIVATE_KEY | destination chain private key containing base curreny required for performing transactions | Private key here |
| DESTINATION_RPC_URL | destination chain rpc url      | https://ethereum-goerli-rpc.allthatnode.com | |
| DESTINATION_TOKEN_BRIDGE | destination chain token bridge      | 0xF890982f9310df57d00f659cf4fd87e65adEd8d7 | [https://book.wormhole.com/reference/contracts.html#token-bridge-1](https://book.wormhole.com/reference/contracts.html#token-bridge-1) |
2. Make sure the Token to be attested is present in source chain. Native fee coins in source and destination chain is sufficient
3. import this use-case with
```typescript
import { attest } from '@klaytn-developer-sdk/bridge-wormhole/use-cases';
```
## 2.Transfer Tokens
To transfer tokens from source chain to destination chain for EVM compatible chains, please perform the following steps:
1. Make sure the required params updated. Below table explains the variables required for attestation process. 

| Variable        | Description           | Example  | References |
| ------------- | ------------- | ------------- | ------------- |
| WORMHOLE_REST_URL | wormhole rest api | https://wormhole-v2-testnet-api.certus.one | [https://book.wormhole.com/reference/rpcnodes.html](https://book.wormhole.com/reference/rpcnodes.html) |
| SOURCE_PRIVATE_KEY | source chain private key containing base curreny required for performing transactions | Private key here | |
| SOURCE_RPC_URL | source chain rpc url      | https://api.baobab.klaytn.net:8651 |
| SOURCE_CORE_BRIDGE | source chain core bridge address      | 0x1830CC6eE66c84D2F177B94D544967c774E624cA | [https://book.wormhole.com/reference/contracts.html#core-bridge-1](https://book.wormhole.com/reference/contracts.html#core-bridge-1) |
| SOURCE_TOKEN_BRIDGE | source chain token bridge address      | 0xC7A13BE098720840dEa132D860fDfa030884b09A | [https://book.wormhole.com/reference/contracts.html#token-bridge-1](https://book.wormhole.com/reference/contracts.html#token-bridge-1) |
| SOURCE_WORMHOLE_CHAIN_ID | source chain wormhole chainName      | 13 | [https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts](https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts) |
| DESTINATION_PRIVATE_KEY | destination chain private key containing base curreny required for performing transactions | Private key here |
| DESTINATION_RPC_URL | destination chain rpc url      | https://ethereum-goerli-rpc.allthatnode.com | |
| DESTINATION_TOKEN_BRIDGE | destination chain token bridge      | 0xF890982f9310df57d00f659cf4fd87e65adEd8d7 | [https://book.wormhole.com/reference/contracts.html#token-bridge-1](https://book.wormhole.com/reference/contracts.html#token-bridge-1) |
| DESTINATION_WORMHOLE_CHAIN_ID | destination wormhole chainName      | 2 | [https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts](https://github.com/wormhole-foundation/wormhole/blob/main/sdk/js/src/utils/consts.ts) |
| IS_NATIVE_TRANSFER | is native transfer (Y/N)      | Y | |
| AMOUNT_TO_BE_TRANSFERRED | amount to be transferred (Ex: 1 coin) | 1 | |
2. Make sure the tokens/coins in source chain and native fee coins in destination chain is sufficient
3. import this use-case with
```typescript
import { transferBasics } from '@klaytn-developer-sdk/bridge-wormhole/use-cases';
```

## Reference Docs:

- [https://www.npmjs.com/package/@certusone/wormhole-sdk](https://www.npmjs.com/package/@certusone/wormhole-sdk) 
- [https://book.wormhole.com/technical/typescript/attestingToken.html](https://book.wormhole.com/technical/typescript/attestingToken.html)
- [Testnet Website URL](https://wormhole-foundation.github.io/example-token-bridge-ui/#/transfer)
- [Mainnet Website URL](https://www.portalbridge.com/#/transfer)