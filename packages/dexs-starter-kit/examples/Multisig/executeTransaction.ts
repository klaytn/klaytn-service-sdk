import { MultiSig} from "../../services"
import { KIP7__factory, KIP7 } from '../../contracts';
import { Wallet, providers, BigNumber, constants } from 'ethers'
import { config } from 'dotenv'
config()
;( async ()=> {
    console.log('ExecuteTransaction# initiating...')
    const rpcURL = process.env.RPC_URL!
    const privKey = process.env.PRIVATE_KEY!
    const pubKey = process.env.PUBLIC_KEY!
    const multisigAddress = process.env.MULTISIG!
    const transactionId = process.env.TRANSACTION_ID!

    console.log('ExecuteTransaction# Multisig => setting up')
    const multiSig = new MultiSig(multisigAddress, privKey, rpcURL);
    console.log('ExecuteTransaction# Multisig => transactionId => checking')
    const confirmatoins = await multiSig.multiSig.getConfirmations(transactionId)
    if(confirmatoins.length == 0) throw new Error('ExecuteTransaction# Multisig => transactionId => invalid')

    console.log(`ExecuteTransaction# Multisig => transactionId => ${confirmatoins.length} owner(s) has already confirmed`)

    console.log('ExecuteTransaction# Multisig => owner => checking')
    // if(confirmatoins.includes(pubKey)) throw new Error('ExecuteTransaction# Multisig => owner => already confirmed')
    const owners = await multiSig.multiSig.getOwners()
    if (!owners.includes( pubKey)) throw new Error('ExecuteTransaction# Multisig => owner => signer is not an owner');
    console.log('ExecuteTransaction# Multisig => owner => valid')

    console.log('ExecuteTransaction# Multisig => Transaction => preparing')
    const confirmTx = await multiSig.executeTransaction(transactionId);
    console.log('ExecuteTransaction# Multisig => Transaction => txHash: ' + confirmTx.hash)
    console.log('ExecuteTransaction# Multisig => Transaction => waiting for block confirmations')
    await confirmTx.wait(parseInt(process.env.CONFIRMATIONS!) || 6)
    console.log(`ExecuteTransaction# Multisig => Transaction => ${confirmTx.confirmations} blocks confirmed`)
    if((await multiSig.multiSig.getTransactionInfo(transactionId)).executed_)
        console.log('ExecuteTransaction# Multisig => transactionId => executed')
    else console.log('ExecuteTransaction# Multisig => OOPS => something went wrong!') // hint: increase gasLimit

})()
