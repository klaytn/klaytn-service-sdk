import { ITransferObject } from "../constants/type"
import { EstimateAmtRequest } from "../ts-proto/gateway/gateway_pb"
import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"

import { transactor } from "../helper"
import { BigNumber, Contract } from "ethers"

export const poolBasedTransfer = async (
    bridge: Contract,
    rpc: string,
    addr: string,
    estimateRequest: EstimateAmtRequest,
    transferObject: ITransferObject,
    srcChainId: number,
    isNative?: boolean
): Promise<any> => {
    const client = new WebClient(rpc, null, null)
    const estimateAmount = await client.estimateAmt(estimateRequest, null)
    console.log("Max slippage "+estimateAmount.getMaxSlippage());
    const { transferToken, toChain, value, nonce } = transferObject

    try {
        let result = await transactor(
            isNative
                ? bridge.sendNative(
                      addr,
                      value,
                      BigNumber.from(toChain?.id),
                      BigNumber.from(nonce),
                      BigNumber.from(estimateAmount.getMaxSlippage() || 0),
                      { value: value, gasLimit: 100000 }
                  )
                : bridge.send(
                      addr,
                      transferToken?.token?.address,
                      value,
                      BigNumber.from(toChain?.id),
                      BigNumber.from(nonce),
                      BigNumber.from(estimateAmount.getMaxSlippage() || estimateRequest.getSlippageTolerance() || 0),
                      {gasLimit: 100000 }
                  ),
                  srcChainId
        )
        return result;
    } catch (err: any) {
        console.log("PoolBasedTransfer.ts - error:", err.reason)
    }
}
