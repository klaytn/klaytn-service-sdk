import {getTransferStatus } from "./GetData"
import { GetTransferStatusResponse } from "../ts-proto/gateway/gateway_pb"
import { clearInterval } from "timers"


export const statusTracker = async (rpc: string, transferId: string, callback?: any, statusCode?: number) => {
    let observerdStatus: number = statusCode ? statusCode : 0;
    const interval  = setInterval(async () => {
        const res: GetTransferStatusResponse.AsObject = await getTransferStatus(rpc, transferId);

        if (res.status === 1 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.info("cBRIDGE => TRANSFER_SUBMITTING")

        } else if (res.status === 2 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.error("cBRIDGE => TRANSFER_FAILED")
            console.log("Tx Details: ", res)
            clearInterval(interval); // TODO: this may entering into default refund mode so monitoring status may still require

        } else if (res.status === 3 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.info("cBRIDGE => TRANSFER_WAITING_FOR_SGN_CONFIRMATION")

        } else if (res.status === 4 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.info("cBRIDGE => TRANSFER_WAITING_FOR_FUND_RELEASE")

        }else if (res.status === 5 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.log("cBRIDGE => TRANSFER_COMPLETED")
            console.log("Tx Details: ", res)
            clearInterval(interval);

        }else if (res.status === 6 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.warn("cBRIDGE => TRANSFER_TO_BE_REFUNDED")
            console.log("Initiate the Refund process, e.g: examples/***FlowRefund.ts")
            console.log("Tx Details: ", res)
            clearInterval(interval)
                callback ? callback(res) : null;

        }else if (res.status === 7 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.info("cBRIDGE => TRANSFER_REQUESTING_REFUND")

        }else if (res.status === 8 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.warn("cBRIDGE => TRANSFER_REFUND_TO_BE_CONFIRMED")
            // TODO: WithdrawalTx
            callback ? callback(res) : null;

        }else if (res.status === 9 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.info("cBRIDGE => TRANSFER_CONFIRMING_YOUR_REFUND")

        }else if (res.status === 10 && res.status !== observerdStatus) {
            observerdStatus = res.status;
            console.log("cBRIDGE => TRANSFER_REFUNDED")
            console.log("Tx Details: ", res)
            clearInterval(interval);
        }

    }, 10000); // 10 seconds interval


}
