import { MultiSigWallet, MultiSigWallet__factory } from '../contracts';
import { Wallet, providers, ContractTransaction } from 'ethers'

export class MultiSig {
    public multiSig: MultiSigWallet;

    constructor(multiSigAddress: string, privKey: string, rpcURL: string) {
        this.multiSig = MultiSigWallet__factory.connect(multiSigAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    /**
     * A function to submit transaction on MULTISIG contract for later votings & execution.
     * @notice only registered owner on MULTISIG contract & who has already voted the given transactionId can execute this function
     * @param {string} value - KLAY amount to send in wei (if no value to send pass 0).
     * @param {string} destination - the contract on which given rawTx to be executed (once got enough votes).
     * @param {string} data - the encoded rawTx data which is required to be submitted.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async submitTransaction(destination: string, value: string, data: string): Promise<ContractTransaction> {
        return this.multiSig.submitTransaction(
            destination,
            value,
            data
        )
    }


    /**
     * A function to vote & execute the transaction (if it has received enough votes).
     * @notice only registered owner on MULTISIG contract can execute this function
     * @param {string} transactionId - the id of the transaction you want to vote and execute.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async confirmAndExecuteTransaction(transactionId: string): Promise<ContractTransaction> {
        return this.multiSig.confirmAndExecuteTransaction(
            transactionId, {gasLimit: 200000}
        )
    }

    /**
     * A function to revoke vote from given transaction id.
     * @notice only registered owner on MULTISIG contract & who has already voted the given transactionId can execute this function
     * @param {string} transactionId - the id of the transaction needs to be executed.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async revokeConfirmation(transactionId: string): Promise<ContractTransaction> {
        return this.multiSig.revokeConfirmation(
            transactionId
        )
    }

    /**
     * A function execute the given transaction id (if it has already received enough votes).
     * @notice only registered owner on MULTISIG contract can execute this function
     * @param {string} transactionId - the id of the transaction needs to be executed.
     * @return {Promise<ContractTransaction>} - ContractTransaction object.
     */
    public async executeTransaction(transactionId: string): Promise<ContractTransaction> {
        return this.multiSig.executeTransaction(
            transactionId, {gasLimit: 200000}
        )
    }
    /**
     * A function to check if given transactionId has got enought votes or not
     * @param {string} transactionId - the id of the transaction needs to be checked.
     * @return {Promise<boolean>} - flag indicating if transaction got enough votes or not (true/false).
     */
    public async isConfirmed(transactionId: string): Promise<boolean> {
        return this.multiSig.isConfirmed(
            transactionId
        )
    }

    // Getters
    /**
     * A getter function to return Multisig contract's instance
     * @return {MultiSigWallet} - MULTISIG Wallet contract's instance.
     */
    public getMultiSig(): MultiSigWallet {
        return this.multiSig
    }
}
