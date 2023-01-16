import { Staking } from "../../core"

/**
 * A function that encodes all the details required to update start and end blocks in given staking pool contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @param {string} startBlock - new starting reward block number.
 * @param {string} rewardEndBlock - new ending reward block number.
 * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function updateStartAndEndBlocks(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    stakingAddress: string,
    startBlock: string,
    rewardEndBlock: string
): Promise<string> {
    console.log('updateStartAndEndBlocks# initiating...')

    console.log('updateStartAndEndBlocks# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('updateStartAndEndBlocks# Staking => Transaction => encoding')
    const rawTx = await staking.updateStartAndEndBlocks(startBlock, rewardEndBlock)

    console.log('updateStartAndEndBlocks# Staking => Transaction => ready to submit on MultiSig')
    console.log('updateStartAndEndBlocks# Staking => Transaction => encoded data => ', rawTx)
    return rawTx;
}
