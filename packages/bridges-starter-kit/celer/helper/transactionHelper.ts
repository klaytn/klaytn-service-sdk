import { BigNumber, utils } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { parseUnits } from "@ethersproject/units"
import { safeParseUnits } from "celer-web-utils/lib/format"
import { ITransferConfigs, ITransferObject } from "../constants/type"
import { signer } from "./constant"

export const getTransferId = (
    address: string,
    tokenAddress?: string,
    value?: BigNumber,
    toChainId?: number,
    nonce?: number,
    fromChainId?: number
) => {
    return utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint64", "uint64", "uint64"],
        [
            address,
            address,
            tokenAddress,
            value?.toString(),
            toChainId?.toString(),
            nonce?.toString(),
            fromChainId?.toString(),
        ]
    )
}

export const transactor = async (tx: any): Promise<void> => {
    let result: TransactionResponse
    if (tx instanceof Promise) {
        result = await tx
    } else {
        if (!tx.gasPrice) {
            tx.gasPrice = parseUnits("4.1", "gwei")
        }
        if (!tx.gasLimit) {
            tx.gasLimit = BigNumber.from(120000)
        }
        result = await signer.sendTransaction(tx)
    }
}

export const getTransferObject = (
    transferConfigs: ITransferConfigs,
    transferValue: string = "10000"
): ITransferObject => {
    const transferObject: ITransferObject = {}
    const transferToken = transferConfigs.chain_token["8217"].token.find(
        ({ token }) => token.symbol === "USDT"
    )
    const fromChain = transferConfigs.chains.find(({ id }) => id === 8217)
    const toChain = transferConfigs.chains.find(({ id }) => id === 56)

    const value = safeParseUnits(transferValue, transferToken?.token?.decimal ?? 18)
    const nonce = new Date().getTime()

    Object.assign(transferObject, { transferToken, fromChain, toChain, value, nonce })
    return transferObject
}
