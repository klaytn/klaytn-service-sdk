# DEX Starter Kit
This module of Klaytn-SDK includes the integration of [@klaytn/dex-contracts](https://www.npmjs.com/package/@klaytn/dex-contracts).
# Folder Structure
- **[/contracts](/packages/dexs-starter-kit/contracts)** - includes typechain implementation of all the DEX's contracts i.e: [@klaytn/dex-contracts](https://www.npmjs.com/package/@klaytn/dex-contracts)
- **[/core](/packages/dexs-starter-kit/core)** - includes all the integration scripts of DEX-contracts core functionalities
  - **[/Swap.ts](/packages/dexs-starter-kit/core/Swap.ts)** - includes all the integration scripts of DEX's Swap contract
  - **[/Liquidity.ts](/packages/dexs-starter-kit/core/Liquidity.ts)** - includes all the integration scripts of DEX's Liquidity contract
  - **[/MultiSig.ts](/packages/dexs-starter-kit/core/MultiSig.ts)** - includes all the integration scripts of DEX's Multisig contract
  - **[/Farming.ts](/packages/dexs-starter-kit/core/Farming.ts)** - includes all the integration scripts of DEX's Farming contract
  - **[/Staking.ts](/packages/dexs-starter-kit/core/Staking.ts)** - includes all the integration scripts of DEX's Staking contract
  - **[/index.ts](/packages/dexs-starter-kit/core/index.ts)** - is main file of all _`core/`_ scripts mentioned above.
  - **[/Config.ts](/packages/dexs-starter-kit/core/Config.ts)** - provides direct instance of each DEX's contract for the sake of customized functionalities to get integrated more easily.
- **[/examples](/packages/dexs-starter-kit/use-cases)** - includes examples of each core service (mentioned above)
  - **[/Swap](/packages/dexs-starter-kit/use-cases/Swap)** - includes examples of Swap contract
    - **[/swapTokensForExactTokens.ts](/packages/dexs-starter-kit/use-cases/Swap/swapTokensForExactKlay.ts)** - includes an example script of swapping Tokens for exact Tokens.
    - **[/swapExactTokensForTokens.ts](/packages/dexs-starter-kit/use-cases/Swap/swapExactTokensForTokens.ts)** - includes an example script of swapping exact Tokens for Tokens.
    - **[/swapExactKlayForTokens.ts](/packages/dexs-starter-kit/use-cases/Swap/swapExactKlayForTokens.ts)** - includes an example script of swapping exact KLAY for Tokens.
    - **[/swapExactTokensForKlay.ts](/packages/dexs-starter-kit/use-cases/Swap/swapExactTokensForKlay.ts)** - includes an example script of swapping exact KLAY for Tokens.
    - **[/swapTokensForExactKlay.ts](/packages/dexs-starter-kit/use-cases/Swap/swapTokensForExactKlay.ts)** - includes an example script of swapping Tokens for exact KLAY.
    - **[/swapKlayForExactTokens.ts](/packages/dexs-starter-kit/use-cases/Swap/swapKlayForExactTokens.ts)** - includes an example script of swapping KLAY for exact Tokens.  
  - **[/Liquidity](/packages/dexs-starter-kit/use-cases/Liquidity)** - includes examples of Liquidity contract
    - **[/addLiquidity.ts](/packages/dexs-starter-kit/use-cases/Liquidity/addLiquidity.ts)** - includes an example script of adding liquidity in given pair.
    - **[/addLiquidityWithKlay.ts](/packages/dexs-starter-kit/use-cases/Liquidity/addLiquidityWithKlay.ts)** - includes an example script of adding KLAY liquidity in given pair.
    - **[/removeLiquidity.ts](/packages/dexs-starter-kit/use-cases/Liquidity/removeLiquidity.ts)** - includes an example script of removing liquidity (LP token of given pair).
    - **[/removeLiquidityWithKlay.ts](/packages/dexs-starter-kit/use-cases/Liquidity/removeLiquidityWithKlay.ts)** - includes an example script of removing liquidity (LP token of given KLAY pair).
  - **[/Multisig](/packages/dexs-starter-kit/use-cases/Multisig)** - includes examples of Multisig contract
    - **[/submitTransaction.ts](/packages/dexs-starter-kit/use-cases/Multisig/submitTransaction.ts)** - includes an example script of submitting given raw transaction data on Mutlisig contract.
    - **[/confirmAndExecuteTransaction.ts](/packages/dexs-starter-kit/use-cases/Multisig/confirmAndExecuteTransaction.ts)** - includes an example script of confirming/voting the given transactionID.
    - **[/executeTransaction.ts](/packages/dexs-starter-kit/use-cases/Multisig/executeTransaction.ts)** - includes an example script of executing transactionID who got enough votes/confirmations.
    - **[/revokeConfirmation.ts](/packages/dexs-starter-kit/use-cases/Multisig/revokeConfirmation.ts)** - includes an example script of revoking confirmation/vote from given transactionID.
  - **[/Farming](/packages/dexs-starter-kit/use-cases/Farming)** - includes examples of Farming contract
    - **[/addPool.ts](/packages/dexs-starter-kit/use-cases/Farming/addPool.ts)** - includes an example script of adding new pool to Farming contract
    - **[/deposit.ts](/packages/dexs-starter-kit/use-cases/Farming/deposit.ts)** - includes an example script of depositing given LP tokens in given pool
    - **[/withdraw.ts](/packages/dexs-starter-kit/use-cases/Farming/withdraw.ts)** - includes an example script of withdrawing given LP tokens from given pool
    - **[/emergencyWithdraw.ts](/packages/dexs-starter-kit/use-cases/Farming/emergencyWithdraw.ts)** - includes an example script for emergencyWithraw the lP token from given pool (using Multisig contract)
    - **[/minterRole.ts](/packages/dexs-starter-kit/use-cases/Farming/minterRole.ts)** - includes an example script to grant minter role on Platform Token to Farming contract (using Multisig contract)
    - **[/setPool.ts](/packages/dexs-starter-kit/use-cases/Farming/setPool.ts)** - includes an example script to update allocation points of given pool (using Multisig contract)
    - **[/updateMultiplier.ts](/packages/dexs-starter-kit/use-cases/Farming/updateMultiplier.ts)** - includes an example script to update bonus multiplier of given pool (using Multisig contract)
    - **[/updateRewardPerBlock.ts](/packages/dexs-starter-kit/use-cases/Farming/updateRewardPerBlock.ts)** - includes an example script to update reward per block of given pool (using Multisig contract)
  - **[/Staking](/packages/dexs-starter-kit/use-cases/Staking)** - includes examples of Staking contract
    - **[/deployPool.ts](/packages/dexs-starter-kit/use-cases/Staking/deployPool.ts)** - includes an example script to deploy new staking pool using StakingFactory contract
    - **[/deposit.ts](/packages/dexs-starter-kit/use-cases/Staking/deposit.ts)** - includes an example script to stake tokens of given staking pool contract
    - **[/withdraw.ts](/packages/dexs-starter-kit/use-cases/Staking/withdraw.ts)** - includes an example script to withdraw staked tokens from given staking pool contract
    - **[/emergencyWithdraw.ts](/packages/dexs-starter-kit/use-cases/Staking/emergencyWithdraw.ts)** - includes an example script to emergency withdraw staked tokens from given staking pool contract (using Multisig contract)
    - **[/emergencyRewardWithdraw.ts](/packages/dexs-starter-kit/use-cases/Staking/emergencyRewardWithdraw.ts)** - includes an example script to emergency withdraw reward tokens from given staking pool contract (using Multisig contract)
    - **[/recoverToken.ts](/packages/dexs-starter-kit/use-cases/Staking/recoverToken.ts)** - includes an example script to recover token accidentally sent to Staking contract (using Multisig contract)
    - **[/stopReward.ts](/packages/dexs-starter-kit/use-cases/Staking/stopReward.ts)** - includes an example script to stop reward on given staking pool contract (using Multisig contract)
    - **[/updatePoolLimit.ts](/packages/dexs-starter-kit/use-cases/Staking/updatePoolLimit.ts)** - includes an example script to update pool limit of given staking pool contract (using Multisig contract)
    - **[/updateReward.ts](/packages/dexs-starter-kit/use-cases/Staking/updateReward.ts)** - includes an example script to update reward per block of given staking pool contract (using Multisig contract)
    - **[/updateStartAndEndBlock.ts](/packages/dexs-starter-kit/use-cases/Staking/updateStartAndEndBlocks.ts)** - includes an example script to update reward start & end block numbers of given staking pool contract (using Multisig contract)
# How to setup
1. `npm install`
2. Copy `.env-examples` file to `.env` and set environment variables as per the example script you're going to run (mentioned below)
# How to run the examples
To run example scripts please refer to the relevant example section below
#### Note:
Relevant .env variables should be set/updated before running each example.
## Liquidity
### 1. addLiquidity
`npm run example:liquidity:add`
### 2. addLiquidityWithKlay
`npm run example:liquidity:addWithKlay`
### 3. removeLiquidity
`npm run example:liquidity:remove`
### 4. removeLiquidityWithKlay
`npm run example:liquidity:removeWithKlay`
## Swap
### 1. swapExactTokensForTokens
`npm run example:swap:exactTokensForTokens`
### 2. swapTokensForExactTokens
`npm run example:swap:tokensForExactTokens`
### 3. swapExactKlayForTokens
`npm run example:swap:exactKlayForTokens`
### 4. swapTokensForExactKlay
`npm run example:swap:tokensForExactKlay`
### 5. swapExactTokensForKlay
`npm run example:swap:exactTokensForKlay`
### 6. swapKlayForExactTokens
`npm run example:swap:klayForExactTokens`
## Farming
### 1. addPool
`npm run example:farming:addPool`
### 2. minterRole
`npm run example:farming:minterRole`
### 3. setPool
`npm run example:farming:setPool`
### 4. updateRewardPerBlock
`npm run example:farming:updateRewardPerBlock`
### 5. updateMultiplier
`npm run example:farming:updateMultiplier`
### 6. deposit
`npm run example:farming:deposit`
### 7. withdraw
`npm run example:farming:withdraw`
### 8. emergencyWithdraw
`npm run example:farming:emergencyWithdraw`
## Multisig
### 1. submitTransaction
`npm run example:multisig:submitTransaction`
### 2. confirmAndExecuteTransaction
`npm run example:multisig:confirm&Execute`
### 3. executeTransaction
`npm run example:multisig:executeTransaction`
### 4. revokeConfirmation
`npm run example:multisig:revokeConfirmation`
## Staking
### 1. deployPool
`npm run example:staking:deployPool`
### 2. updatePoolLimit
`npm run example:staking:updatePoolLimit`
### 3. stopReward
`npm run example:staking:stopReward`
### 4. updateReward
`npm run example:staking:updateReward`
### 5. updateStartAndEndBlocks
`npm run example:staking:updateStartAndEndBlocks`
### 6. recoverToken
`npm run example:staking:recoverToken`
### 7. emergencyRewardWithdraw
`npm run example:staking:emergencyRewardWithdraw`
### 8. deposit
`npm run example:staking:deposit`
### 9. withdraw
`npm run example:staking:withdraw`
### 10. emergencyWithdraw
`npm run example:staking:emergencyWithdraw`
#### Note:
Relevant .env variables should be updated before running each example.




