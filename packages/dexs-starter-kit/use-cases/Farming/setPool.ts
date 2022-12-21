import { Farming} from "../../core"
import { constants } from 'ethers'
const rpcURL = process.env.RPC_URL!
const privKey = process.env.PRIVATE_KEY!
const pubKey = process.env.PUBLIC_KEY!
const farmingAddress = process.env.FARMING!
const allocPoints = process.env.ALLOC_POINTS!
const poolId = process.env.POOL_ID!

/**
 * A function that encodes all the details required to update / set LP farming pool.
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey - public key / address of account with which you want to sign the transaction.
 * @param {string} farmingAddress - Farming contract's address of whom given farming pool is going to be updated.
 * @param {string} allocPoints - Number of allocation points to be set in given farming pool.
 * @param {string} poolId - id of the LP farming pool whose allocPoints to be set/updated.
 * @return {string} - encoded raw transaction data to be submitted & executed by Multisig contract.
 */
export async function setPool(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    farmingAddress: string,
    allocPoints: string,
    poolId: string
): Promise<string> {
    console.log('setPool# initiating...')

    console.log('setPool# Farming => setting up')
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('setPool# Farming => pool => checking')
    const pool = await farming.farming.poolInfo(poolId)
    if (pool.lpToken == constants.AddressZero) throw new Error('setPool# Farming => pool => not found')
    console.log('setPool# Farming => pool => found')
    console.log('setPool# Farming => Transaction => encoding')
    const addRawTx = await farming.set(allocPoints, poolId)
    console.log('setPool# Farming => Transaction => ready to submit on MultiSig')
    console.log('setPool# Farming => Transaction => encoded data => ', addRawTx)
    return addRawTx;
}
