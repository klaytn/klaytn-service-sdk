# Klaytn cBridge starter kit
- [Klaytn cBridge starter kit](#klaytn-cbridge-starter-kit)
  - [About](#about)
  - [Folder Structure](#folder-structure)
  - [Setup](#setup)
  - [Overview & use-cases](docs/Overview.md)
  - [ENV Variables explanation](docs/ParamsExplanation.md)
  - [Prerequisits](docs/Prerequisites.md)
  - [Reference Docs:](#reference-docs)

## About
cBridge provides a simple liquidity provider experience and high liquidity efficiency for users when they manage their funds in different
chains with lower costs. Learn more about flow and terminology from this doc:
[cBridge requirements](https://docs.google.com/document/d/15gVJfiAjzfR9dyz_ad7jQOx5PSPI6p_RanLA6XRLCYU/edit?usp=sharing)

## Folder Structure

- [use-cases](./use-cases): Ready-to-run code examples to call the cBridge gateway via the REST API.
- [core](./core): cBridge client implementation.
  - [APIs](./core/APIs): cBridge client core logic.
  - [contracts](./core/contract): Generated cBridge contract ABIs and bindings.
  - [proto](./core/proto): gRPC-Web Protobuf definitions.
  - [ts-proto](./core/ts-proto): Generated .d.ts gRPC-Web bindings.

## Setup
To install dependencies
```shell
npm install
```

## Reference Docs:

- https://cbridge-docs.celer.network/developer/cbridge-sdk
- https://github.com/celer-network/cBridge-typescript-client
- https://test-cbridge-v2.celer.network/ (Testnet Website URL)
- https://cbridge.celer.network (Mainnet Website URL)
