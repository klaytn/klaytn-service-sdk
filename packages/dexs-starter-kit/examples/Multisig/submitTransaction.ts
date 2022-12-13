import { MultiSig} from "../../core"
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('submitTransaction# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const multisigAddress = process.env.MULTISIG!
    const targetContract = process.env.DESTINATION!
    const rawTx = process.env.DATA!

    console.log('submitTransaction# Multisig => setting up')
    const multiSig = new MultiSig(multisigAddress, privKey, rpcURL);
    console.log('submitTransaction# Multisig => owner => checking')
    const owners = await multiSig.multiSig.getOwners()
    if (!owners.includes( pubKey)) throw new Error('submitTransaction# Multisig => owner => signer not an owner');
    console.log('submitTransaction# Multisig => owner => valid')

    console.log('submitTransaction# Multisig => Transaction => preparing')
    const submitTx = await multiSig.submitTransaction(targetContract, '0', rawTx);
    console.log('submitTransaction# Multisig => Transaction => txHash: ' + submitTx.hash)
    console.log('submitTransaction# Multisig => Transaction => waiting for confirmations')
    await submitTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log('submitTransaction# Multisig => Transaction => confirmed')
    console.log('submitTransaction# Multisig => DONE')

})()
