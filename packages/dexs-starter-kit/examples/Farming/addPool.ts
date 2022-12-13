import { Farming} from "../../core"
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('addFarmingPool# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const farmingAddress = process.env.FARMING!
    const lpAddress = process.env.LP_TOKEN!
    const allocPoints = process.env.ALLOC_POINTS!
    const bonusMultiplier = process.env.BONUS_MULTIPLIER!
    const bonusEndBlock = process.env.BONUS_END_BLOCK!

    console.log('addFarmingPool# Farming => setting up')
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('addFarmingPool# Farming => Transaction => encoding')
    const addRawTx = await farming.add(allocPoints, lpAddress, bonusMultiplier, bonusEndBlock);

    console.log('addFarmingPool# Farming => Transaction => ready to submit on MultiSig')
    console.log('addFarmingPool# Farming => Transaction => encoded data => ', addRawTx)

})()
