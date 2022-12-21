import { Staking } from "../../core"

/**
 * A function that encodes all the details required to emergency withdraw funds from given staking pool contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @param {string} amount - amount of staked token to be withdrawn.
 * @param {string} recipientAddress - address of recipient account to whom staked tokens should be sent.
 * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function emergencyRewardWithdraw(
    rpcURL:string,
    privKey:string,
    pubKey:string,
    stakingAddress:string,
    amount:string,
    recipientAddress:string
) {
    console.log('emergencyRewardWithdraw# initiating...')

    console.log('emergencyRewardWithdraw# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('emergencyRewardWithdraw# Staking => Transaction => encoding')
    const rawTx = await staking.emergencyRewardWithdraw(amount, recipientAddress)

    console.log('emergencyRewardWithdraw# Staking => Transaction => ready to submit on MultiSig')
    console.log('emergencyRewardWithdraw# Staking => Transaction => encoded data => ', rawTx)
    return rawTx;

}
