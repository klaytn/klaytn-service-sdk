export function Wallet() {

}

export const providers = {
    JsonRpcProvider: function() {

    }
}

export function Contract() {
    return {
        createWrapped: async () => {
            return { hash: "0x1234"};
        },
        wrappedAsset: async () => {
            return "0x345";
        },
        allowance: async () => {
            return "1000";
        },
        approve: async () => {
            return {hash: "0x1234"};
        },
        completeTransfer: async () => {
            return {hash: "0x345"};
        }
    };
}

export const utils = {
    Interface: function() {

    },
    parseUnits: () => {
        return {
            toString : () => {
                return "1000";
            },
            gt: () => {
                return true;
            }
        };
    }
}