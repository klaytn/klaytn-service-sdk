import { transferConfigs } from "./constants";

export default {
    get: async function(url) {
        let response = {}
        if(url.indexOf("getTransferConfigsForAll") !== -1) {
            response = { data: transferConfigs }
        }
        return response
    }
}