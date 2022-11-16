import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"
import { GetTransferStatusResponse, WithdrawLiquidityRequest, WithdrawMethodType } from "../ts-proto/gateway/gateway_pb"
import { WithdrawReq, WithdrawType } from "../ts-proto/sgn/cbridge/v1/tx_pb"
import { getTransferStatus } from "./GetData"
import { parseRefundTxResponse } from "./withdraw"
import { Contract, ContractTransaction } from "ethers"
import { transactor } from "../helper"

const srcChainId = parseInt(process.env.CHAIN1_ID!);

export const requestRefund = async (bridge: Contract, rpc: string, transferId: string, estimated: string) => {
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
    let withdrawalTx: ContractTransaction;
    if (wres.getErr()) {
        detailInter = setInterval(async () => {
            const res:GetTransferStatusResponse.AsObject  = await getTransferStatus(rpc, transferId)
            if (res?.status == 8 && !withdrawalTx.blockNumber) {
                    console.log("status:", res.status)
                    // clearInterval(detailInter)
                    const { wdmsg, sigs, signers, powers } =  parseRefundTxResponse(res.wdOnchain, res.signersList, res.sortedSigsList, res.powersList)
                     withdrawalTx = await transactor(
                        bridge.withdraw(
                            wdmsg,
                            sigs,
                            signers,
                            powers),
                        srcChainId
                    )
            } else if (res.status === 0) {
                console.error("status: unknown")
                clearInterval(detailInter)
            } else if (res.status === 10) {
                console.log("funds have been refunded")
                // clearInterval(detailInter)
            }
        }, 2000)
    } else {
        console.log(`Refund error`, wres.getErr()?.toObject())
    }
}
