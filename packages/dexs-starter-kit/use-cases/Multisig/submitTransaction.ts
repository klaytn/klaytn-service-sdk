import { MultiSig} from "../../core"
import { ContractReceipt } from 'ethers'

/**
 * A function to submit transaction on MULTISIG contract for later votings & execution.
 * @notice only registered owner on MULTISIG contract & who has already voted the given transactionId can execute this function
 * @param {string} rpcURL - RPC URL of blockchain provider.
 * @param {string} privKey - secret key of account with which you want to sign the transaction.
 * @param {string} pubKey- public key / address of account with which you want to sign the transaction.
 * @param {string} multisigAddress - MULTISIG contract's address.
 * @param {string} targetContract - the contract on which given rawTx to be executed (once got enough votes).
 * @param {string} rawTx - the encoded rawTx data which is required to be submitted.
 * @param {number} confirmations - number of blocks confirmations a transaction should achieve to proceed.
 * @return {Promise<ContractReceipt>} - ContractTransaction object.
 */
export async function submitTransaction(
    rpcURL: string,
    privKey: string,
    pubKey: string,
    multisigAddress: string,
    targetContract: string,
    rawTx: string,
    confirmations: number
):Promise<ContractReceipt> {
    console.log('submitTransaction# initiating...')

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
    const receipt = await submitTx.wait(confirmations || 6)
    console.log('submitTransaction# Multisig => Transaction => confirmed')
    console.log('submitTransaction# Multisig => DONE')
    return receipt;
}
