import { Farming} from "../../services"
import { constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('setPool# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const farmingAddress = process.env.FARMING!
    const allocPoints = process.env.ALLOC_POINTS!
    const poolId = process.env.POOL_ID!

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

})()
