import {
    EstimateAmtRequest,
    EstimateWithdrawAmtRequest,
    WithdrawInfo,
} from "../ts-proto/gateway/gateway_pb"

export const estimateAmt = (
    srcChainId: number,
    dstChainId: number,
    tokenSymbol: string,
    usrAddr: string,
    slippageTolerance: number,
    amt: string
): EstimateAmtRequest => {
    const estimateRequest = new EstimateAmtRequest()
    estimateRequest.setSrcChainId(srcChainId)
    estimateRequest.setDstChainId(dstChainId)
    estimateRequest.setTokenSymbol(tokenSymbol)
    estimateRequest.setUsrAddr(usrAddr)
    estimateRequest.setSlippageTolerance(slippageTolerance)
    estimateRequest.setAmt(amt)

    return estimateRequest
}

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
