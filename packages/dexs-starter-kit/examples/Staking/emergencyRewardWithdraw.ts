import { Staking } from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('emergencyRewardWithdraw# initiating...')
    const rpcURL = process.env.RPC_URL! as string
    const privKey = process.env.PRIVATE_KEY! as string
    const pubKey = process.env.PUBLIC_KEY! as string
    const stakingAddress = process.env.STAKING! as string
    const amount = process.env.AMOUNT! as string
    const recipientAddress = process.env.RECIPIENT! as string

    console.log('emergencyRewardWithdraw# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('emergencyRewardWithdraw# Staking => Transaction => encoding')
    const rawTx = await staking.emergencyRewardWithdraw(amount, recipientAddress)

    console.log('emergencyRewardWithdraw# Staking => Transaction => ready to submit on MultiSig')
    console.log('emergencyRewardWithdraw# Staking => Transaction => encoded data => ', rawTx)

})()
