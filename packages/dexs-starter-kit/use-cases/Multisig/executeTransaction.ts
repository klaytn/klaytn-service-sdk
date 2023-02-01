import { MultiSig} from "../../core"
import { ContractReceipt } from 'ethers'
/**
 * A function execute the given transaction id (if it has already received enough votes).
 * @notice only registered owner on MULTISIG contract can execute this function
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} multisigAddress - MULTISIG contract's address.
 * @param {string} transactionId - the id of the transaction needs to be executed.
 * @param {number} confirmations - number of blocks confirmations a transaction should achieve to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function executeTransaction(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    multisigAddress: string,
    transactionId: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('ExecuteTransaction# initiating...')


    console.log('ExecuteTransaction# Multisig => setting up')
    const multiSig = new MultiSig(multisigAddress, privKey, rpcURL);
    console.log('ExecuteTransaction# Multisig => transactionId => checking')
    const confirmatoins = await multiSig.multiSig.getConfirmations(transactionId)
    if(confirmatoins.length == 0) throw new Error('ExecuteTransaction# Multisig => transactionId => invalid')

    const txInfo = await multiSig.multiSig.getTransactionInfo(transactionId);
    const requiredConfirmations = await multiSig.multiSig.required();

    if (txInfo.votesLength_.lt(requiredConfirmations)) throw new Error(`ExecuteTransaction# Multisig => transactionId => confirmations# ${txInfo.votesLength_.toString()}, required# ${requiredConfirmations.toString()}`)
    if (txInfo.executed_) throw new Error('ExecuteTransaction# Multisig => transactionId => already executed')

    console.log(`ExecuteTransaction# Multisig => transactionId => Good`)
    console.log('ExecuteTransaction# Multisig => owner => checking')

    const owners = await multiSig.multiSig.getOwners()
    if (!owners.includes( pubKey)) throw new Error('ExecuteTransaction# Multisig => owner => signer is not an owner');
    console.log('ExecuteTransaction# Multisig => owner => Good')

    console.log('ExecuteTransaction# Multisig => Transaction => preparing')
    const confirmTx = await multiSig.executeTransaction(transactionId);
    console.log('ExecuteTransaction# Multisig => Transaction => txHash: ' + confirmTx.hash)
    console.log('ExecuteTransaction# Multisig => Transaction => waiting for block confirmations')
    const receipt = await confirmTx.wait(confirmations || 6)
    console.log(`ExecuteTransaction# Multisig => Transaction => ${confirmTx.confirmations} blocks confirmed`)
    if((await multiSig.multiSig.getTransactionInfo(transactionId)).executed_)
        console.log('ExecuteTransaction# Multisig => transactionId => executed')
    else console.log('ExecuteTransaction# Multisig => OOPS => something went wrong!') // hint: increase gasLimit
    return receipt;
}
