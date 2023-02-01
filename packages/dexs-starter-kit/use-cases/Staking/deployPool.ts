import { Staking } from "../../core"

/**
 * A function that encodes all the details required to deploy a new Staking Pool.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} factoryAddress - Staking Factory contract's address.
 * @param {string} stakedTokenAddress - Address of the KIP7 token which will be staked in this Staking Pool.
 * @param {string} rewardTokenAddress - Address of the KIP7 token in which stakers will get their reward.
 * @param {string} rewardPerBlock - Number of tokens to be rewarded per block (in rewardToken)
 * @param {string} startBlock - Block number from where staking will get started.
 * @param {string} rewardEndBlock - Block number at which reward distribution will get ended.
 * @param {string} poolLimitPerUser - pool limit per user in stakedToken (if any, else 0).
 * @param {string} blocksForUserLimit - block numbers available for user limit (after start block).
 * @param {string} multiSigAddress - MULTISIG contract address.
 * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function deployPool(
    rpcURL: string,
    privKey: string,
    pubKey:string ,
    factoryAddress:string,
    stakedTokenAddress:string,
    rewardTokenAddress:string,
    rewardPerBlock:string,
    startBlock:string,
    rewardEndBlock:string,
    poolLimitPerUser:string,
    blocksForUserLimit:string,
    multiSigAddress:string
): Promise<string> {
    console.log('deployPool# initiating...')

    console.log('deployPool# StakingFactory => setting up')
    const StakingFactory = Staking.FACTORY(factoryAddress, privKey, rpcURL);

    console.log('deployPool# StakingFactory => Transaction => encoding')
    const rawTx = Staking.deployPool(
                    StakingFactory,
                    stakedTokenAddress,
                    rewardTokenAddress,
                    rewardPerBlock,
                    startBlock,
                    rewardEndBlock,
                    poolLimitPerUser,
                    blocksForUserLimit,
                    multiSigAddress
                );

    console.log('deployPool# StakingFactory => Transaction => ready to submit on MultiSig')
    console.log('deployPool# StakingFactory => Transaction => encoded data => ', rawTx)
    return rawTx;

}
