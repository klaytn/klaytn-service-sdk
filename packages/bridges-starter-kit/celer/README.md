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
Set variables in `.env`

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

### Mint

```sh
ts-node examples/mintCanonicalToken.ts
```

### Burn

```sh
ts-node examples/burnCanonicalToken.ts
```

## Reference Docs:

- https://cbridge-docs.celer.network/developer/cbridge-sdk
- https://github.com/celer-network/cBridge-typescript-client
- https://test-cbridge-v2.celer.network/
- https://cbridge.celer.network/1/10/USDC