import { MultiSig} from "../../core"
import { ContractReceipt } from 'ethers'

/**
 * A function to revoke vote from given transaction id.
 * @notic only registered owner on MULTISIG contract & who has already voted the given transactionId can execute this function
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} multisigAddress - MULTISIG contract's address.
 * @param {string} transdactionId - the id of the transaction needs to be executed.
 * @param {number} confirmations - number of blocks confirmations a transaction should achieve to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function revokeConfirmation(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    multisigAddress: string,
    transactionId: string,
    confirmations: number
): Promise<ContractReceipt> {
    console.log('revokeConfirmation# initiating...')

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
    const receipt = await confirmTx.wait(confirmations || 6)
    console.log(`revokeConfirmation# Multisig => Transaction => ${confirmTx.confirmations} blocks confirmed`)
    const txInfo = await multiSig.multiSig.getTransactionInfo(transactionId);

    console.log(`revokeConfirmation# Multisig => transactionId => confirmation revoked`)
    console.log(`revokeConfirmation# Multisig => transactionId => confirmations# ${txInfo.votesLength_.toString()}, required# ${(await multiSig.multiSig.required()).toString()}`)
    return receipt;
}
