import { Farming} from "../../core"

/**
 * A function that encodes all the details required to update bonusMultiplier of given LP farming pool.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} farmingAddress - Farming contract's address of whom given farming pool's bonusMultiplier is to be updated.
 * @param {string} bonusMultiplier - Number of allocation points to be set in given farming pool.
 * @param {string} poolId - id of the LP farming pool whose bonusMultiplier to be updated.
 * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function updateMultiplier(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    farmingAddress: string,
    bonusMultiplier: string,
    poolId: string
): Promise<string> {
    console.log('updateMultiplier# initiating...')

    console.log('updateMultiplier# Farming => setting up')
    if (!(rpcURL && privKey && farmingAddress && bonusMultiplier && poolId)) {
        throw new Error('updateMultiplier# ERROR => some .evn variables are missing!')
    }
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('updateMultiplier# Farming => Transaction => encoding')
    const rawTx = await farming.updateMultiplier(poolId, bonusMultiplier)
    console.log('updateMultiplier# Farming => Transaction => ready to submit on MultiSig')
    console.log('updateMultiplier# Farming => Transaction => encoded data =>', rawTx)
    return rawTx;
}
