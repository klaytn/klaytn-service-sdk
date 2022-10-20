import axios from "axios"
import { ITransferConfigs } from "../constants/type"

export const getTransferConfigs = (rpc: string): Promise<ITransferConfigs> =>
    axios
        .get(`${rpc}/v2/getTransferConfigsForAll`)
        .then(({ data }) => data)
        .catch((err) => console.log(err))
