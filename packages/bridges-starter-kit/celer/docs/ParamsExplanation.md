# PARAMETER Variables
This file contains the detailed explanation of `use-cases` required **`parameter variables`**

## CBRIDGE_GATEWAY_URL
This variable as its name shows, contains the Celer Bridge's Gateway URL (through which our SDK communicates with & performs all core features of cBridge).
From [here](https://cbridge-docs.celer.network/developer/cbridge-sdk#cbridge-testnet-endpoint) you can get Testnet & Mainnet cBridge's Gateway URLs.
## SRC_CHAIN_RPC
At this variable you should set the RPC endpoint of your source-chain (the chain from where you want to send your tokens to other chain)
## SRC_CHAIN_ID
At this variable you should set the chain ID of source-chain. From [here](https://chainlist.org) you can get the chain ID of your source-chain
## DST_CHAIN_RPC
At this variable you should set the RPC endpoint of your destination-chain (the chain to where you want to receive your tokens)
## DST_CHAIN_ID
At this variable you should set the chain ID of destination-chain. From [here](https://chainlist.org) you can get the chain ID of your destination-chain
## TOKEN_SYMBOL
At this variable you should set the SYMBOL of your token, which you want to move from source chain to destination.
You can get SYMBOLS of supported tokens with the pair of chains you've mentioned above at [cBridge](https://test-cbridge-v2.celer.network/5/71401/USDC) web interface
## AMOUNT
This variable is to set the `amount` of token, you want to move from source to destination chain
#### Note:
Amount for burn should always be between min and max burn values of pegged burn contract
- you can get min & max burn amount of given pegged token cBridge contract
  - for example at Godwoken testnet for the token of `USDC: 0x4Ea08DCA142F103ac2D5FF95F1d376712C5EF5a9`
  - you can get maxBurn & minBurn amount from [this](https://gw-explorer.nervosdao.community/address/0x70D4814e111Ad66B90B90D54a44797BC696BcdAF/read-contract#address-tabs) cBridge contract
  - youyou need to provide `USD` address as a parameter in above-mentioned functions (same for other chains & pegged tokens)
## SLIPPAGE_TOLERANCE
At this variable you can set the slippage amount you can tolerate while transferring your tokens from source to destination chain using `poolBasedTransfer` method.
## CONFIRMATIONS
At this variable you can set the number of Blocks confirmations you want a transaction should achieve before considering it mined.
## WALLET_ADDRESS
This should have public key of your wallet / account
## PRIVATE_KEY
This should have private key of your wallet / account
