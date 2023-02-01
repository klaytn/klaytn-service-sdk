import { Staking } from "../../core"

/**
 * A function that encodes all the details required to stop reward distribution in given staking pool contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function stopReward(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    stakingAddress: string
): Promise<string> {
    console.log('stopReward# initiating...')

    console.log('stopReward# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('stopReward# Staking => Transaction => encoding')
    const rawTx = await staking.stopReward()

    console.log('stopReward# Staking => Transaction => ready to submit on MultiSig')
    console.log('stopReward# Staking => Transaction => encoded data => ', rawTx)
    return rawTx;
}
