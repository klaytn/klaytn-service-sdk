import { MultiSig} from "../../services"
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('revokeConfirmation# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const multisigAddress = process.env.MULTISIG!
    const transactionId = process.env.TRANSACTION_ID!

    console.log('revokeConfirmation# Multisig => setting up')
    const multiSig = new MultiSig(multisigAddress, privKey, rpcURL);
    console.log('revokeConfirmation# Multisig => transactionId => checking')
    const confirmatoins = await multiSig.multiSig.getConfirmations(transactionId)
    if(confirmatoins.length == 0) throw new Error('revokeConfirmation# Multisig => transactionId => invalid')

    console.log(`revokeConfirmation# Multisig => transactionId => total confirmations# ${confirmatoins.length}`)

    console.log('revokeConfirmation# Multisig => owner => checking')
    if(!confirmatoins.includes(pubKey)) throw new Error('revokeConfirmation# Multisig => owner => no confirmation found to be revoked')
    /* const owners = await multiSig.multiSig.getOwners()
     if (!owners.includes( pubKey)) throw new Error('revokeConfirmation# Multisig => owner => no confirmation found to be revoked');*/
    console.log('revokeConfirmation# Multisig => owner => valid')

    console.log('revokeConfirmation# Multisig => Transaction => preparing')
    const confirmTx = await multiSig.revokeConfirmation(transactionId);
    console.log('revokeConfirmation# Multisig => Transaction => txHash: ' + confirmTx.hash)
    console.log('revokeConfirmation# Multisig => Transaction => waiting for block confirmations')
    await confirmTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log(`revokeConfirmation# Multisig => Transaction => ${confirmTx.confirmations} blocks confirmed`)
    const txInfo = await multiSig.multiSig.getTransactionInfo(transactionId);

    console.log(`revokeConfirmation# Multisig => transactionId => confirmation revoked`)
    console.log(`revokeConfirmation# Multisig => transactionId => confirmations# ${txInfo.votesLength_.toString()}, required# ${(await multiSig.multiSig.required()).toString()}`)

})()
