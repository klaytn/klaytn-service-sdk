import { Farming} from "../../services"
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('updateMultiplier# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const farmingAddress = process.env.FARMING!
    const bonusMultiplier = process.env.BONUS_MULTIPLIER!
    const poolId = process.env.POOL_ID!

    console.log('updateMultiplier# Farming => setting up')
    if (!(rpcURL && privKey && farmingAddress && bonusMultiplier && poolId)) {
        throw new Error('updateMultiplier# ERROR => some .evn variables are missing!')
    }
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('updateMultiplier# Farming => Transaction => encoding')
    const rawTx = await farming.updateMultiplier(poolId, bonusMultiplier)
    console.log('updateMultiplier# Farming => Transaction => ready to submit on MultiSig')
    console.log('updateMultiplier# Farming => Transaction => encoded data =>', rawTx)

})()
