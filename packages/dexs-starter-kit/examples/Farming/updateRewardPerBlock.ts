import { Farming} from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('updateRewardPerBlock# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const farmingAddress = process.env.FARMING!
    const rewardPerBlock = process.env.REWARD_PER_BLOCKK!

    console.log('updateRewardPerBlock# Farming => setting up')
    if (!(rpcURL && privKey && farmingAddress && rewardPerBlock)) {
        throw new Error('updateRewardPerBlock# ERROR => some .evn variables are missing!')
    }
    const farming = new Farming(farmingAddress, privKey, rpcURL);
    console.log('updateRewardPerBlock# Farming => Transaction => encoding')
    const rawTx = await farming.updatePtnPerBlock(rewardPerBlock)
    console.log('updateRewardPerBlock# Farming => Transaction => ready to submit on MultiSig')
    console.log('updateRewardPerBlock# Farming => Transaction => encoded data =>', rawTx)

})()
