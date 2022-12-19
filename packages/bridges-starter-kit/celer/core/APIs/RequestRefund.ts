import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"
import { GetTransferStatusResponse, WithdrawLiquidityRequest, WithdrawMethodType } from "../ts-proto/gateway/gateway_pb"
import { WithdrawReq, WithdrawType } from "../ts-proto/sgn/cbridge/v1/tx_pb"
import { getTransferStatus } from "./GetData"
import { parseRefundTxResponse } from "./withdraw"
import { Contract, ContractTransaction } from "ethers"
import { getConfirmations, transactor } from "../helper"
import { statusTracker } from "./StatusTracker"

export const requestRefund = async (
    type: string,
    contractInstance: Contract,
    CBRIDGE_GATEWAY_URL: string,
    TRANSFER_ID: string,
    estimated: string,
    SRC_CHAIN_ID: number,
    CONFIRMATIONS: number ) => {
    const client = new WebClient(CBRIDGE_GATEWAY_URL, null, null)

    const timestamp = Math.floor(Date.now() / 1000)
    const withdrawReqProto = new WithdrawReq()
    withdrawReqProto.setXferId(TRANSFER_ID)
    withdrawReqProto.setReqId(timestamp)
    withdrawReqProto.setWithdrawType(WithdrawType.WITHDRAW_TYPE_REFUND_TRANSFER)

    const req = new WithdrawLiquidityRequest()
    req.setWithdrawReq(withdrawReqProto.serializeBinary())
    if(estimated) {
        req.setEstimatedReceivedAmt(estimated)
    }
    req.setMethodType(WithdrawMethodType.WD_METHOD_TYPE_ONE_RM)
    console.log("2. Submitting withdrawal request to cBRIDGE network...");
    const wres = await client.withdrawLiquidity(req, null)
    let refundTx: ContractTransaction;
    if (!wres.getErr() || wres.getErr()?.getCode() == 500) {
        statusTracker(CBRIDGE_GATEWAY_URL, TRANSFER_ID, async (res: GetTransferStatusResponse.AsObject) => {
            if (res.status !== 8) return console.error("invalid transfer status: " + res.status);
            const { wdmsg, sigs, signers, powers } =  parseRefundTxResponse(res.wdOnchain, res.signersList, res.sortedSigsList, res.powersList)
            console.log("3. Confirming Refund Request on-chain...")
            refundTx = await transactor(
                type === "BURN" ?
                    contractInstance.mint(
                        wdmsg,
                        sigs,
                        signers,
                        powers, {gasLimit: 200000 }) :
                    contractInstance.withdraw(
                        wdmsg,
                        sigs,
                        signers,
                        powers, {gasLimit: 200000 }),
                SRC_CHAIN_ID
            )
            if ( !refundTx) return console.log("Error while refunding on-chain");

            console.log("refundTx hash: " + refundTx.hash);
            console.log("Waiting for the confirmations of refundTx");
            const confirmationReceipt = await refundTx.wait(CONFIRMATIONS ?? 6)
             // = await getConfirmations(refundTx.hash, CONFIRMATIONS, type === "BURN" ? DST_CHAIN_RPC: SRC_CHAIN_RPC); // instead of waiting for fixed time, wait for some confirmations
            console.log(`refundTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);

            statusTracker(CBRIDGE_GATEWAY_URL, TRANSFER_ID, null,8);
        }, 7)

    } else {
        console.log(`Refund error`, wres.getErr()?.toObject())
        throw new Error(wres.getErr()?.toObject()?.msg);
    }
}
