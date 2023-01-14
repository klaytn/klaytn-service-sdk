import { Staking } from "../../core"

/**
 * A function that encodes all the details required to update pool limit in given staking pool contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @param {boolean} userLimit - whether the limit remains forced.
 * @param {string} poolLimit - new pool limit per user.
 * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function updatePoolLimit(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    stakingAddress: string,
    userLimit: boolean,
    poolLimit: string
    ): Promise<string> {
    console.log('updatePoolLimit# initiating...')

    console.log('updatePoolLimit# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('updatePoolLimit# Staking => Transaction => encoding')
    const rawTx = await staking.updatePoolLimitPerUser(userLimit, poolLimit)

    console.log('updatePoolLimit# Staking => Transaction => ready to submit on MultiSig')
    console.log('updatePoolLimit# Staking => Transaction => encoded data => ', rawTx)
    return rawTx;
}
