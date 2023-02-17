export function Wallet() {
    return;
}

export const providers = {
    JsonRpcProvider: function() {
        return;
    }
}

export function Contract() {
    return {
        allowance: async () => {
            return { 
                isZero: () => {
                    return true
                }
            }
        },
        approve: async () => {
            return {
                wait: async () => {
                    return { hash: "0x1234", status: 1 }
                }
            }
        },
        deposit: async () => {
            return {
                hash: "0x1235",
                wait: async () => {
                    return { hash: "0x1235"}
                }
            }
        },
        burn: async () => {
            return {
                hash: "0x1235",
                wait: async () => {
                    return { hash: "0x1235", status: 1 }
                }
            }
        },
        send: async () => {
            return {
                hash: "0x345",
                wait: async () => {
                    return {
                        confirmations: 8
                    }
                }
            }
        },
        sendNative: async () => {
            return {
                hash: "0x345",
                wait: async () => {
                    return {
                        confirmations: 8
                    }
                }
            }
        }
    };
}

export const utils = {
    Interface: function() {
        return;
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
    },
    solidityKeccak256: (types) => {
        let hash
        console.log(types)
        if(types.length === 7 && types[2] === 'address') {
            // pool transfer
            hash = "0xcfb407a74a3cf621777a8948ce1e26ee4e6dd5766a3ab26041f599e8ab40184b"
        } else if(types.length === 7 && types[2] === 'uint256') {
            // mint canonical token transfer
            hash = "0xff1a7d4b1153cdf97259070bd2e81515b1b6ed12f38aeb8b44cbebbf96389fc1"
        } else if(types.length === 8) {
            // burn canoncial token transfer
            hash = "0x42f176213beff1ac6ebd94e0dcaa050adc1cc28b9ee6ba97e02082de9864698e"
        }
        return hash
    }
}

export const BigNumber = {
    from: () => {
        return {
            sub: () => {
                return {
                    toString: () => {
                        return "0"
                    }
                }
            }
        }
    }
}