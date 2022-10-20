import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"
import { WithdrawLiquidityRequest, WithdrawMethodType } from "../ts-proto/gateway/gateway_pb"
import { WithdrawReq, WithdrawType } from "../ts-proto/sgn/cbridge/v1/tx_pb"
import { getTransferStatus } from "./GetTransferStatus"

export const requestRefund = async (rpc: string, transferId: string, estimated: string) => {
    const client = new WebClient(rpc, null, null)

    const timestamp = Math.floor(Date.now() / 1000)
    const withdrawReqProto = new WithdrawReq()
    withdrawReqProto.setXferId(transferId)
    withdrawReqProto.setReqId(timestamp)
    withdrawReqProto.setWithdrawType(WithdrawType.WITHDRAW_TYPE_REFUND_TRANSFER)

    const req = new WithdrawLiquidityRequest()
    req.setWithdrawReq(withdrawReqProto.serializeBinary())
    req.setEstimatedReceivedAmt(estimated)
    req.setMethodType(WithdrawMethodType.WD_METHOD_TYPE_ONE_RM)

    const wres = await client.withdrawLiquidity(req, null)
    let detailInter
    if (!wres.getErr()) {
        detailInter = setInterval(async () => {
            const res = await getTransferStatus(rpc, transferId)
            if (res?.status) {
                const status = res.status
                if (status === 8) {
                    console.log("status:", res.status)
                    clearInterval(detailInter)
                }
            } else if (res.status === 0) {
                console.error("status: unknown")
                clearInterval(detailInter)
            } else {
                clearInterval(detailInter)
            }
        }, 5000)
    } else {
        console.log(`Refund error`, wres.getErr()?.toObject())
    }
}
