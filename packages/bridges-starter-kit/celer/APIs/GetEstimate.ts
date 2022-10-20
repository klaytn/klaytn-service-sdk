import { EstimateWithdrawAmt, EstimateWithdrawAmtResponse } from "../ts-proto/gateway/gateway_pb"
import { estimateWithdrawAmt } from "./EstimateWithdrawAmt"
import { getWithdrawInfo } from "./GetWithdrawInfo"
import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"
import { BigNumber } from "ethers"

export const getEstimate = async (
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
