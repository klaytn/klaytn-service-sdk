import { MultiSig} from "../../core"
import { ContractReceipt } from 'ethers'

/**
 * A function to vote & execute the transaction (if it has received enough votes).
 * @notice only registered owner on MULTISIG contract can execute this function
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} multisigAddress - MULTISIG contract's address.
 * @param {string} transactionId - the id of the transaction you want to vote and execute.
 * @param {number} confirmations - number of blocks confirmations a transaction should achieve to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function confirmAndExecuteTransaction(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    multisigAddress: string,
    transactionId: string,
    confirmations: number
):Promise<ContractReceipt> {
    console.log('confirmAndExecuteTransaction# initiating...')


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
    const receipt = await confirmTx.wait(confirmations || 6)
    console.log(`confirmAndExecuteTransaction# Multisig => Transaction => ${confirmTx.confirmations} blocks confirmed`)
    const txInfo = await multiSig.multiSig.getTransactionInfo(transactionId);
    if(txInfo.executed_ )
        console.log('confirmAndExecuteTransaction# Multisig => transactionId => executed')
    else
        console.log(`confirmAndExecuteTransaction# Multisig => transactionId => confirmations# ${txInfo.votesLength_.toString()}, required# ${(await multiSig.multiSig.required()).toString()}`)
    return receipt;
}
