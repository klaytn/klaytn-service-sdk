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
Set variables in `.env`. Note: The below values are used on mainnet

CBRIDGE_GATEWAY_URL=https://cbridge-prod2.celer.app
KLAYTN_RPC=https://public-node-api.klaytnapi.com/v1/cypress
KLAYTN_BRIDGE_CONTRACT=0x4C882ec256823eE773B25b414d36F92ef58a7c0C
BNB_ORIGINAL_TOKEN_VAULT_CONTRACT=0x78bc5Ee9F11d133A08b331C2e18fE81BE0Ed02DC
WALLET_ADDRESS=your_wallet_address  
PRIVATE_KEY=your_private_key

## Quick Start
You can run the below commands to test
### Transfer

```sh
ts-node examples/transferFlow.ts
```

### Refund

```sh
ts-node examples/refundFlow.ts
```

### Mint Canonical Token

```sh
ts-node examples/mintCanonicalToken.ts
```

### Burn Canonical Token

```sh
ts-node examples/burnCanonicalToken.ts
```

## Reference Docs:

- https://cbridge-docs.celer.network/developer/cbridge-sdk
- https://github.com/celer-network/cBridge-typescript-client