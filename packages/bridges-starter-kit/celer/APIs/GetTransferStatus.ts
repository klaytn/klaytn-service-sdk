import { WebClient } from "../ts-proto/gateway/GatewayServiceClientPb"
import { GetTransferStatusRequest, GetTransferStatusResponse } from "../ts-proto/gateway/gateway_pb"

export const getTransferStatus = async (
    rpc: string,
    transferId: string
): Promise<GetTransferStatusResponse.AsObject> => {
    const client = new WebClient(rpc, null, null)
    const statusRequest = new GetTransferStatusRequest()
    statusRequest.setTransferId(transferId)
    const transferStatus = await client.getTransferStatus(statusRequest, null)
    console.log("Transfer Status:", transferStatus.toObject())

    return transferStatus.toObject()
}
