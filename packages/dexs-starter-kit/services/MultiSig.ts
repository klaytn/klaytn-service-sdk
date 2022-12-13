import { MultiSigWallet, MultiSigWallet__factory } from '../contracts';
import { Wallet, providers, ContractTransaction } from 'ethers'

export class MultiSig {
    public multiSig: MultiSigWallet;

    constructor(multiSigAddress: string, privKey: string, rpcURL: string) {
        this.multiSig = MultiSigWallet__factory.connect(multiSigAddress, new Wallet(privKey, new providers.JsonRpcProvider(rpcURL)));
    }

    public async submitTransaction(destination: string, value: string, data: string): Promise<ContractTransaction> {
        return this.multiSig.submitTransaction(
            destination,
            value,
            data
        )
    }
    public async confirmAndExecuteTransaction(transactionId: string): Promise<ContractTransaction> {
        return this.multiSig.confirmAndExecuteTransaction(
            transactionId, {gasLimit: 6721975}
        )
    }
    public async revokeConfirmation(transactionId: string): Promise<ContractTransaction> {
        return this.multiSig.revokeConfirmation(
            transactionId
        )
    }
    public async executeTransaction(transactionId: string): Promise<ContractTransaction> {
        return this.multiSig.executeTransaction(
            transactionId, {gasLimit: 6721975}
        )
    }
    public async isConfirmed(transactionId: string): Promise<boolean> {
        return this.multiSig.isConfirmed(
            transactionId
        )
    }

    // Getters

    public getMultiSig(): MultiSigWallet {
        return this.multiSig
    }
}
