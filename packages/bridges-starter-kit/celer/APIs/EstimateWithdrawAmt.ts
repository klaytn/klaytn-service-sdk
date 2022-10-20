import { EstimateWithdrawAmtRequest, WithdrawInfo } from "../ts-proto/gateway/gateway_pb"

export const estimateWithdrawAmt = (
    withdrawItem: WithdrawInfo[],
    dstChainId: number,
    tokenSymbol: string,
    usrAddr: string
): EstimateWithdrawAmtRequest => {
    const estimateRequest = new EstimateWithdrawAmtRequest()
    estimateRequest.setSrcWithdrawsList(withdrawItem)
    estimateRequest.setDstChainId(dstChainId)
    estimateRequest.setTokenSymbol(tokenSymbol)
    estimateRequest.setUsrAddr(usrAddr)

    return estimateRequest
}
