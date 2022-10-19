import { JSDOM } from 'jsdom';
const { window } = new JSDOM();
global.XMLHttpRequest = window.XMLHttpRequest;

import dotenv from "dotenv"
dotenv.config()

import {
    EstimateWithdrawAmtRequest,
    EstimateWithdrawAmtResponse,
    WithdrawMethodType,
    WithdrawLiquidityRequest,
    WithdrawInfo,
    EstimateWithdrawAmt,
} from "../ts-proto/gateway/gateway_pb"
import { WithdrawReq, WithdrawType } from "../ts-proto/sgn/cbridge/v1/tx_pb"
// import grpc-web WebClient
import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"
import { safeParseUnits } from "celer-web-utils/lib/format"
import { BigNumber } from "@ethersproject/bignumber";

import { getTransferStatus } from "../helper"

const client = new WebClient(process.env.CBRIDGE_GATEWAY_URL || "", null, null)

const getEstimate = async () => {
    const withdrawItem = new WithdrawInfo()
    withdrawItem.setChainId(8217) // KLAYTN
    withdrawItem.setAmount(safeParseUnits("10000", 6).toString())
    withdrawItem.setSlippageTolerance(1000000)

    const estimateReq = new EstimateWithdrawAmtRequest()
    estimateReq.setSrcWithdrawsList(Array(withdrawItem))
    estimateReq.setDstChainId(8217) // KLAYTN
    estimateReq.setTokenSymbol("USDT")
    estimateReq.setUsrAddr(process.env.WALLET_ADDRESS!)

    const res: EstimateWithdrawAmtResponse = await client.estimateWithdrawAmt(estimateReq, null)

    let estimateResult = ""
    if (!res.getErr() && res.getReqAmtMap()) {
        const resMap = res.getReqAmtMap()
        resMap.forEach((entry: EstimateWithdrawAmt, key: number) => {
            if (key === 8217) {
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

const requestRefund = async (transferId) => {
    const estimated = await getEstimate()

    let detailInter
    if (estimated) {
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
        if (!wres.getErr()) {
            detailInter = setInterval(async () => {
                const res = await getTransferStatus(client, transferId)
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
};

(async() => {
    await requestRefund(`0x56db0c7245e9fac0e66b393467cafabfe0c15bfb1b27af9b140bd4b6c3b3e60e`);
})()
