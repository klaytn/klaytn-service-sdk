# Overview
This @klaytn-sdk module contains scripts to help you interact / integrate cBridge into your applications robustly
without explicitly digging into cBridge technical documentation or scratching your head ;)

# What is a cBridge
Celer Bridge (cBridge) as its name shows is a cryptocurrency cross-chain bridge that helps in moving your assets from one chain to the other with lower costs.
Want to learn more about cBridge ? [This](https://cbridge-docs.celer.network) should help you in your quest.

# What can I do with this module?
If you're a fan of thanos and looking for an _infinity stone_ to roll out cBridge support in your application
with just one snap! you're at right place :) 
![img.jpg](img/img.jpg)

Let me tell you what will happen after thanos snap

## 1. PoolBased Transfer
You will be able to transfer your assets using cBridge's `pool based transfer`
method. It's a liquidity based transfer in which your assets are locked at source_chain (sending chain) and released on
destination_chain (receiving chain) from a pool of liquidity available on the destination chain.
Thanos snap 🫰 for this is: 
```
import { poolTransfer } from @klaytn-sdk/bridge-celer/use-cases
```

### 1.1. PoolBased Refund Transfer
Due to any reason if your funds / assets were not released on destination_chain, don't worry you can get them back on
source_chain by submitting refund request.
🫰 of it:
``` 
import{ poolTransferRefund } from @klaytn-sdk/bridge-celer/use-cases
```
## 2. mintCanonicalToken
You will be able to transfer your assets using cBridge's `Mint Canonical Token`
method. It's a traditional method in which your assets are locked at source_chain (sending chain) and minted on
destination_chain (receiving chain).
Thanos snap 🫰 for this is:
```
import { mintCanonicalToken } from @klaytn-sdk/bridge-celer/use-cases
```

### 2.1. Refund mintCanonicalToken
Due to any reason if your funds / assets were not minted on destination_chain, don't worry you can get them back on
source_chain by submitting refund request.
🫰 of it:
``` 
import{ mintCanonicalTokenRefund } from @klaytn-sdk/bridge-celer/use-cases
```
## 3. burnCanonicalToken
You will also be able to withdraw your assets from destination chain to source chain (the chain from where you sent tokens earlier) using cBridge's `Burn Canonical Token`
method. It's a method in which your assets get burnt at source_chain ( the chain from where you're withdrawing your assets) and released on
destination_chain (the chain on which you want to receive you withdrawn assets).
Thanos snap 🫰 for this is:
```
import { burnCanonicalToken } from @klaytn-sdk/bridge-celer/use-cases
```

### 3.1. Refund mintCanonicalToken
Due to any reason if your funds / assets were not released on destination_chain, don't worry you can get them back on
source_chain by submitting refund request.
🫰 of it:
``` 
import{ burnCanonicalTokenRefund } from @klaytn-sdk/bridge-celer/use-cases
```
