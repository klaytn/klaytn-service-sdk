import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"
import { GetTransferStatusResponse, WithdrawLiquidityRequest, WithdrawMethodType } from "../ts-proto/gateway/gateway_pb"
import { WithdrawReq, WithdrawType } from "../ts-proto/sgn/cbridge/v1/tx_pb"
import { getTransferStatus } from "./GetData"
import { parseRefundTxResponse } from "./withdraw"
import { Contract, ContractTransaction } from "ethers"
import { getConfirmations, transactor } from "../helper"
import { statusTracker } from "./StatusTracker"

const srcChainId = parseInt(process.env.CHAIN1_ID!);
const confirmations: number = parseInt(process.env.CONFIRMATIONS ? process.env.CONFIRMATIONS : "6");

export const requestRefund = async (type: string, contractInstance: Contract, rpc: string, transferId: string, estimated: string) => {
    const client = new WebClient(rpc, null, null)

    const timestamp = Math.floor(Date.now() / 1000)
    const withdrawReqProto = new WithdrawReq()
    withdrawReqProto.setXferId(transferId)
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
        statusTracker(rpc, transferId, async (res: GetTransferStatusResponse.AsObject) => {
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
                srcChainId
            )
            if ( !refundTx) return console.log("Error while refunding on-chain");

            console.log("refundTx hash: " + refundTx.hash);
            console.log("Waiting for the confirmations of refundTx");
            const confirmationReceipt = await getConfirmations(refundTx.hash, confirmations, type === "BURN" ? process.env.CHAIN2_RPC!: process.env.CHAIN1_RPC!); // instead of waiting for fixed time, wait for some confirmations
            console.log(`refundTx confirmed upto ${confirmationReceipt.confirmations} confirmations`);

            statusTracker(rpc, transferId, null,8);
        }, 7)

    } else {
        console.log(`Refund error`, wres.getErr()?.toObject())
        throw new Error(wres.getErr()?.toObject()?.msg);
    }
}
