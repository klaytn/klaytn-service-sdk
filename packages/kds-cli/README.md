# Klaytn Developer SDK CLI

kds-cli is a command line utility for klaytn developer sdk. <br/>
kds-cli supports below features.
* `Oracles` - Hardhat project containing Chainlink, Witnet integrations with klaytn.

## Install

```typescript
npm install -g @klaytn/kds-cli --force
```

## Quick Usage

### Version

```bash
> kds-cli --version 
0.0.1
```

### Help

```typescript
> kds-cli --help
> kds-cli help oracle
```
### Setup

#### Oracles

To download the Klaytn's integration with Chainlink, witnet oracle hardhat project, please follow below steps

```typescript
> kds-cli oracle init

> cd oracle-starter-kit
> npm install --force
```

Above command downloads the `oracle-starter-kit` hardhat folder structure in the current project directory. 
Enter inside the generated folder and install the packages as mentioned and please follow the `oracle-starter-kit` README description.