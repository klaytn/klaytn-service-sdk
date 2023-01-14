import { Staking } from "../../core"

/**
 * A function that encodes all the details required to update reward per block in given staking pool contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @param {string} rewardPerBlock - new reward per block to be set.
 * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function updateReward(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    stakingAddress: string,
    rewardPerBlock: string
): Promise<string> {
    console.log('updateReward# initiating...')

    console.log('updateReward# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('updateReward# Staking => Transaction => encoding')
    const rawTx = await staking.updateRewardPerBlock(rewardPerBlock)

    console.log('updateReward# Staking => Transaction => ready to submit on MultiSig')
    console.log('updateReward# Staking => Transaction => encoded data => ', rawTx)
    return rawTx;
}
