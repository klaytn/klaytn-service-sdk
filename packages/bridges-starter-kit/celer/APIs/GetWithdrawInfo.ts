import { safeParseUnits } from "celer-web-utils/lib/format"
import { WithdrawInfo } from "../ts-proto/gateway/gateway_pb"

export const getWithdrawInfo = (
    chainId: number,
    amount: string,
    slippageTolerance: number
): WithdrawInfo => {
    const withdrawInfo = new WithdrawInfo()
    withdrawInfo.setChainId(chainId)
    withdrawInfo.setAmount(safeParseUnits(amount, 6).toString())
    withdrawInfo.setSlippageTolerance(slippageTolerance)

    return withdrawInfo
}
