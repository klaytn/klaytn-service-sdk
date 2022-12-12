import { MultiSig} from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('confirmAndExecuteTransaction# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const multisigAddress = process.env.MULTISIG!
    const transactionId = process.env.TRANSACTION_ID!

    console.log('confirmAndExecuteTransaction# Multisig => setting up')
    const multiSig = new MultiSig(multisigAddress, privKey, rpcURL);
    console.log('confirmAndExecuteTransaction# Multisig => transactionId => checking')
    const confirmatoins = await multiSig.multiSig.getConfirmations(transactionId)
    if(confirmatoins.length == 0) throw new Error('confirmAndExecuteTransaction# Multisig => transactionId => invalid')

    console.log(`confirmAndExecuteTransaction# Multisig => transactionId => ${confirmatoins.length} owner(s) has already confirmed`)

    console.log('confirmAndExecuteTransaction# Multisig => owner => checking')
    if(confirmatoins.includes(pubKey)) throw new Error('confirmAndExecuteTransaction# Multisig => owner => already confirmed')
    const owners = await multiSig.multiSig.getOwners()
    if (!owners.includes( pubKey)) throw new Error('confirmAndExecuteTransaction# Multisig => owner => signer is not an owner');
    console.log('confirmAndExecuteTransaction# Multisig => owner => valid')

    console.log('confirmAndExecuteTransaction# Multisig => Transaction => preparing')
    const confirmTx = await multiSig.confirmAndExecuteTransaction(transactionId);
    console.log('confirmAndExecuteTransaction# Multisig => Transaction => txHash: ' + confirmTx.hash)
    console.log('confirmAndExecuteTransaction# Multisig => Transaction => waiting for block confirmations')
    await confirmTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log(`confirmAndExecuteTransaction# Multisig => Transaction => ${confirmTx.confirmations} blocks confirmed`)
    const txInfo = await multiSig.multiSig.getTransactionInfo(transactionId);
    if(txInfo.executed_ )
        console.log('confirmAndExecuteTransaction# Multisig => transactionId => executed')
    else
        console.log(`confirmAndExecuteTransaction# Multisig => transactionId => confirmations# ${txInfo.votesLength_.toString()}, required# ${(await multiSig.multiSig.required()).toString()}`)

})()
