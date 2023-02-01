import { Farming} from "../../core"

/**
 * A function that encodes all the details required to create a new LP farming pool.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} farmingAddress - Farming contract's address.
 * @param {string} lpAddress - Address of the LP KIP7 token.
 * @param {string} allocPoints - Number of allocation points for the new pool.
 * @param {string} bonusMultiplier - The pool reward multipler.
 * @param {string} bonusEndBlock - The block number after which the pool doesn't get any reward bonus from `bonusMultiplier`.
 * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function addPool(
    rpcURL: string,
    privKey: string,
    farmingAddress: string,
    lpAddress: string,
    allocPoints: string,
    bonusMultiplier: string,
    bonusEndBlock: string
): Promise<string> {
    console.log('addFarmingPool# initiating...')

    console.log('addFarmingPool# Farming => setting up')
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('addFarmingPool# Farming => Transaction => encoding')
    const addRawTx = await farming.add(allocPoints, lpAddress, bonusMultiplier, bonusEndBlock);

    console.log('addFarmingPool# Farming => Transaction => ready to submit on MultiSig')
    console.log('addFarmingPool# Farming => Transaction => encoded data => ', addRawTx)
    return addRawTx;


}
