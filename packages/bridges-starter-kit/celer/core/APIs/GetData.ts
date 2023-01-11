import {
    EstimateWithdrawAmt,
    EstimateWithdrawAmtResponse,
    GetTransferStatusRequest,
    GetTransferStatusResponse,
    WithdrawInfo,
} from "../ts-proto/gateway/gateway_pb"
import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"
import { BigNumber } from "ethers"
import { estimateWithdrawAmt } from "./Estimate"
import axios from "axios"
import { ITransferConfigs } from "../constants/type"
import { safeParseUnits } from "celer-web-utils/lib/format"

export const getTransferConfigs = (rpc: string): Promise<ITransferConfigs> =>
    axios
        .get(`${rpc}/v2/getTransferConfigsForAll`)
        .then(({ data }) => data)
        .catch((err) => console.log(err))

export const getTransferStatus = async (
    rpc: string,
    transferId: string
): Promise<GetTransferStatusResponse.AsObject> => {
    const client = new WebClient(rpc, null, null)
    const statusRequest = new GetTransferStatusRequest()
    statusRequest.setTransferId(transferId)
    const transferStatus = await client.getTransferStatus(statusRequest, null)
    // console.log("Transfer Status:", transferStatus.toObject())

    return transferStatus.toObject()
}

export const getWithdrawInfo = (
    chainId: number,
    amount: string,
    slippageTolerance: number
): WithdrawInfo => {
    const withdrawInfo = new WithdrawInfo()
    withdrawInfo.setChainId(chainId)
    withdrawInfo.setAmount(safeParseUnits(amount, 6).toString())
    withdrawInfo.setSlippageTolerance(slippageTolerance)

    return withdrawInfo
}

export const getEstimation = async (
    rpc: string,
    addr: string,
    chainId: number,
    tokenSymbol: string,
    amount: string,
    slippageTolerance: number
) => {
    const client = new WebClient(rpc, null, null)

    const withdrawInfo = getWithdrawInfo(chainId, amount, slippageTolerance)
    const estimateRequest = estimateWithdrawAmt(Array(withdrawInfo), chainId, tokenSymbol, addr)

    const res: EstimateWithdrawAmtResponse = await client.estimateWithdrawAmt(estimateRequest, null)
    let estimateResult = ""
    if (!res.getErr() && res.getReqAmtMap()) {
        const resMap = res.getReqAmtMap()
        resMap.forEach((entry: EstimateWithdrawAmt, key: number) => {
            if (key === chainId) {
                const totleFee =
                    (Number(entry.getBaseFee()) + Number(entry.getPercFee())).toString() || "0"
                const eqValueTokenAmtBigNum = BigNumber.from(entry.getEqValueTokenAmt())
                const feeBigNum = BigNumber.from(totleFee)
                const targetReceiveAmounts = eqValueTokenAmtBigNum.sub(feeBigNum)
                estimateResult = targetReceiveAmounts.toString()
            }
        })
    }
    return estimateResult
}
