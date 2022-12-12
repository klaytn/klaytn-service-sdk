import { Staking } from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('updateStartAndEndBlocks# initiating...')
    const rpcURL = process.env.RPC_URL! as string
    const privKey = process.env.PRIVATE_KEY! as string
    const pubKey = process.env.PUBLIC_KEY! as string
    const stakingAddress = process.env.STAKING! as string
    const startBlock = process.env.START_BLOCK! as string
    const rewardEndBlock = process.env.REWARD_END_BLOCK! as string

    console.log('updateStartAndEndBlocks# Staking => setting up')
    const staking = new Staking(stakingAddress, privKey, rpcURL);

    console.log('updateStartAndEndBlocks# Staking => Transaction => encoding')
    const rawTx = await staking.updateStartAndEndBlocks(startBlock, rewardEndBlock)

    console.log('updateStartAndEndBlocks# Staking => Transaction => ready to submit on MultiSig')
    console.log('updateStartAndEndBlocks# Staking => Transaction => encoded data => ', rawTx)

})()
