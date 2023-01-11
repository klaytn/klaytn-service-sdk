import { Farming} from "../../core"

/**
 * A function that encodes all the details required to update rewardPerBlock of Farming contract.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} farmingAddress - Farming contract's address of whose rewardPerBlock is to be updated.
 * @param {string} rewardPerBlock - Number of platform tokens to be given as reward per block.
 * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function updateRewardPerBlock(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    farmingAddress: string,
    rewardPerBlock: string
): Promise<string> {
    console.log('updateRewardPerBlock# initiating...')

    console.log('updateRewardPerBlock# Farming => setting up')
    if (!(rpcURL && privKey && farmingAddress && rewardPerBlock)) {
        throw new Error('updateRewardPerBlock# ERROR => some .evn variables are missing!')
    }
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('updateRewardPerBlock# Farming => Transaction => encoding')
    const rawTx = await farming.updatePtnPerBlock(rewardPerBlock)
    console.log('updateRewardPerBlock# Farming => Transaction => ready to submit on MultiSig')
    console.log('updateRewardPerBlock# Farming => Transaction => encoded data =>', rawTx)
    return rawTx;
}
