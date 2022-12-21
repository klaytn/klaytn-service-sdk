import { Staking } from "../../core"
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('recoverToken# initiating...')
    const rpcURL = process.env.RPC_URL! as string
    const privKey = process.env.PRIVATE_KEY! as string
    const pubKey = process.env.PUBLIC_KEY! as string
    const stakingAddress = process.env.STAKING! as string
    const tokenAddress = process.env.TOKEN! as string
    const recipientAddress = process.env.RECIPIENT! as string

    console.log('recoverToken# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('recoverToken# Staking => Transaction => encoding')
    const rawTx = await staking.recoverToken(tokenAddress, recipientAddress)

    console.log('recoverToken# Staking => Transaction => ready to submit on MultiSig')
    console.log('recoverToken# Staking => Transaction => encoded data => ', rawTx)

})()
