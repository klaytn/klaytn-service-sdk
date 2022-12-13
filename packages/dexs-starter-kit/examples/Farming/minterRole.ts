import { Farming} from "../../services"
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('minterRole# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const farmingAddress = process.env.FARMING!
    const platformTokenAddress = process.env.KDEX!

    console.log('minterRole# Farming => setting up')
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('minterRole# Farming => role => checking')
    let roleTx: string | boolean = await farming.ptnGrantRole(platformTokenAddress);
    if(!roleTx) throw new Error('minterRole# Farming => role => already MINTER_ROLE granted')
    console.log('minterRole# Farming => role => need to be granted')
    console.log('minterRole# Farming => Transaction => encoding')

    console.log('minterRole# Farming => Transaction => ready to submit on MultiSig')
    console.log('minterRole# Farming => Transaction => details:', roleTx)

})()
