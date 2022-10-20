import { ITransferObject } from "../constants/type"
import { EstimateAmtRequest } from "../ts-proto/gateway/gateway_pb"
import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"

import { bridge, transactor } from "../helper"
import { BigNumber } from "ethers"

export const poolBasedTransfer = async (
    rpc: string,
    addr: string,
    estimateRequest: EstimateAmtRequest,
    transferObject: ITransferObject
): Promise<void> => {
    const client = new WebClient(rpc, null, null)
    const estimateAmount = await client.estimateAmt(estimateRequest, null)
    const isNativeToken = false

    const { transferToken, toChain, value, nonce } = transferObject

    try {
        await transactor(
            isNativeToken
                ? bridge.sendNative(
                      addr,
                      value,
                      BigNumber.from(toChain?.id),
                      BigNumber.from(nonce),
                      BigNumber.from(estimateAmount.getMaxSlippage() || 0),
                      { value }
                  )
                : bridge.send(
                      addr,
                      transferToken?.token?.address,
                      value,
                      BigNumber.from(toChain?.id),
                      BigNumber.from(nonce),
                      BigNumber.from(estimateAmount.getMaxSlippage() || 0)
                  )
        )
    } catch (err: any) {
        console.log("PoolBasedTransfer.ts - error:", err.reason)
    }
}