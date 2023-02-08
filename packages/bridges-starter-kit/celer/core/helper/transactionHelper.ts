import { BigNumber, Contract, ethers, utils } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { parseUnits } from "@ethersproject/units"
import { safeParseUnits } from "celer-web-utils/lib/format"
import { ITransferConfigs, ITransferObject } from "../constants/type"
import { getSigner } from "./constant"
import ERC20ABI from "../contract/abi/pegged/tokens/ERC20Permit/SingleBridgeTokenPermit.sol/SingleBridgeTokenPermit.json"
import { Token } from "../constants/type"
const tokenInterface = new utils.Interface(ERC20ABI.abi)

export const getBridgeContractAddress = (transferConfigs: ITransferConfigs, chainId: number) => {
    return transferConfigs.chains.find(chain => chain.id === chainId)?.contract_addr
}

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

export const transactor = async (tx: any, rpcURL: string, privateKey: string): Promise<ethers.ContractTransaction> => {
    let result: TransactionResponse;
    if (tx instanceof Promise) {
        result = await tx;
    } else {
        if (!tx.gasPrice) {
            tx.gasPrice = parseUnits("4.1", "gwei")
        }
        if (!tx.gasLimit) {
            tx.gasLimit = BigNumber.from(120000)
        }
        result = await getSigner(rpcURL, privateKey).sendTransaction(tx);
    }
    return result;
}

export const getTransferObject = (
    transferConfigs: ITransferConfigs,
    srcChainId: number,
    dstChainId: number,
    tokenSymbol: string,
    transferValue: string
): ITransferObject => {
    const transferObject: ITransferObject = {}
    const transferToken = transferConfigs.chain_token[`${srcChainId}`]?.token.find(
        ({ token }) => token.symbol === tokenSymbol
    )
    const fromChain = transferConfigs.chains.find(({ id }) => id === srcChainId)
    const toChain = transferConfigs.chains.find(({ id }) => id === dstChainId)

    const value = safeParseUnits(transferValue, transferToken?.token?.decimal ?? 18)
    const nonce = new Date().getTime()

    Object.assign(transferObject, { transferToken, fromChain, toChain, value, nonce })
    return transferObject
}

export const getPegConfig = (
    transferConfigs: ITransferConfigs,
    srcChainId: number,
    dstChainId: number,
    tokenSymbol: string
) => {
    const depositConfigs = transferConfigs.pegged_pair_configs.filter(
        (e) =>
            e.org_chain_id === srcChainId &&
            e.pegged_chain_id === dstChainId &&
            e.org_token.token.symbol === tokenSymbol
    )

    if (depositConfigs.length) {
        return depositConfigs[0]
    }

    const burnConfigs = transferConfigs.pegged_pair_configs.filter(
        (e) =>
            e.org_chain_id === dstChainId &&
            e.pegged_chain_id === srcChainId &&
            e.org_token.token.symbol === tokenSymbol
    )

    if (burnConfigs.length) {
        return burnConfigs[0]
    }

    return
}

const isNonEVMChain = (chainId: number) => {
    if (
        chainId === 12340001 ||
        chainId === 12340002 ||
        chainId === 999999998 ||
        chainId === 999999999
    ) {
        return true
    }
    return false
}

const getTokenBalanceAddress = (
    originalAddress: string,
    fromChainId: number | undefined = undefined,
    tokenSymbol: string | undefined = undefined,
    peggedPairs: Array<any> | undefined = undefined
) => {
    if (!fromChainId || !tokenSymbol || !peggedPairs) {
        return originalAddress
    }

    const peggedTokens = peggedPairs?.filter((item) => {
        return (
            item.pegged_chain_id === fromChainId && tokenSymbol === item.pegged_token.token.symbol
        )
    })

    if (
        peggedTokens &&
        peggedTokens.length > 0 &&
        peggedTokens[0].canonical_token_contract_addr.length > 0
    ) {
        return peggedTokens[0].canonical_token_contract_addr
    }

    if (isNonEVMChain(fromChainId)) {
        const nonEVMDeposit = peggedPairs?.find((peggedPairConfig) => {
            return (
                peggedPairConfig.org_chain_id === fromChainId &&
                peggedPairConfig.org_token.token.symbol === tokenSymbol
            )
        })

        if (nonEVMDeposit) {
            return nonEVMDeposit.pegged_token.token.address
        }

        const nonEVMBurn = peggedPairs?.find((peggedPairConfig) => {
            return (
                peggedPairConfig.pegged_chain_id === fromChainId &&
                peggedPairConfig.pegged_token.token.symbol === tokenSymbol
            )
        })

        if (nonEVMBurn) {
            return nonEVMBurn.org_token.token.address
        }
    }

    return originalAddress
}

export const getAllowance = async (
    walletAddress: string,
    spenderAddress: string,
    originalAddress: string,
    fromChainId: number | undefined = undefined,
    tokenSymbol: string | undefined = undefined,
    rpcURL: string,
    peggedPairs: Array<any> | undefined = undefined
) => {
    const tokenAddress = getTokenBalanceAddress(
        originalAddress,
        fromChainId,
        tokenSymbol,
        peggedPairs
    )
    const tokenContract = new Contract(tokenAddress, tokenInterface, getSigner(rpcURL))
    const allowance = await tokenContract?.allowance(walletAddress, spenderAddress)
    return allowance
}

export const checkApprove = (allowance: BigNumber, amount: string, token?: Token, isNative?: boolean) : boolean => {
    /**Native token case */
    if(isNative) {
        return false;
    }
    if (!allowance || allowance.isZero()) {
        return true
    }
    console.log("Allowance: "+allowance.toString());
    console.log("Amount   : "+safeParseUnits(amount || "0", token?.decimal ?? 18).toString());
    try {
        const isGreatThanAllowance = safeParseUnits(amount || "0", token?.decimal ?? 18).gt(
            allowance
        )
        return isGreatThanAllowance
    } catch {
        return true
    }
}

export const approve = async (spenderAddress: string, rpcURL: string, privateKey: string, token?: Token, amount?: string) => {
    if (!token) {
        return
    }
    try {
        const tokenContract = new Contract(token.address, tokenInterface, getSigner(rpcURL, privateKey))
        const approveTx = await transactor(
                tokenContract.approve(spenderAddress, safeParseUnits(amount || "0", token?.decimal ?? 18), {gasLimit: 100000 }),
                rpcURL,
                privateKey
            )
        await approveTx.wait()
        return approveTx
    } catch (e) {
        console.error(`-Failed to approve token. Error:`, e)
        return
    }
}
