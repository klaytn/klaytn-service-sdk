import { Staking } from "../../core"
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('stopReward# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const stakingAddress = process.env.STAKING!

    console.log('stopReward# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('stopReward# Staking => Transaction => encoding')
    const rawTx = await staking.stopReward()

    console.log('stopReward# Staking => Transaction => ready to submit on MultiSig')
    console.log('stopReward# Staking => Transaction => encoded data => ', rawTx)

})()
