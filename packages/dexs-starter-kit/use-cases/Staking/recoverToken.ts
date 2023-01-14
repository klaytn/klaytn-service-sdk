import { Staking } from "../../core"

/**
 * A function that encodes all the details required to recover token (unintentionally transferred) from given staking pool contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} stakingAddress - Staking Pool contract's address.
 * @param {string} tokenAddress - KIP7 token's address which is to be recovered.
 * @param {string} recipientAddress - address of recipient account to whom recovered tokens should be sent.
 * @return {Promise<string>} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function recoverToken(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    stakingAddress: string,
    tokenAddress: string,
    recipientAddress: string
): Promise<string> {
    console.log('recoverToken# initiating...')

    console.log('recoverToken# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('recoverToken# Staking => Transaction => encoding')
    const rawTx = await staking.recoverToken(tokenAddress, recipientAddress)

    console.log('recoverToken# Staking => Transaction => ready to submit on MultiSig')
    console.log('recoverToken# Staking => Transaction => encoded data => ', rawTx)
    return rawTx;
}
