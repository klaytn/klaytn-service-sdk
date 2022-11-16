import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { config } from "dotenv"
config()

import { getTransferStatus, getTransferConfigs, requestRefund } from "../APIs"
import {
    getContract,
    getPegConfig,
    transactor,
} from "../helper";
import PeggedTokenBridgeABI from '../contract/abi/pegged/PeggedTokenBridge.sol/PeggedTokenBridge.json';
import PeggedTokenBridgeV2ABI from '../contract/abi/pegged/PeggedTokenBridgeV2.sol/PeggedTokenBridgeV2.json';

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!

;(async () => {
    const srcChainId = parseInt(process.env.CHAIN2_ID!);
    const dstChainId = parseInt(process.env.CHAIN1_ID!);

    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const transferId = "0x6085feec485c109c7c23b2bee61b2ca3f8a78418ac859e48f088f24914a60b6d"; //Replace your transfer Id here

    const transferConfigs = await getTransferConfigs(rpc);

    const peggedTokenBridgeAddress = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === srcChainId && config.bridge_version < 2)?.pegged_burn_contract_addr
    const peggedTokenBridge = getContract(peggedTokenBridgeAddress || '', PeggedTokenBridgeABI.abi, srcChainId)
    const peggedTokenBridgeV2Address = transferConfigs.pegged_pair_configs.find(config => config.pegged_chain_id === srcChainId && config.bridge_version === 2)?.pegged_burn_contract_addr
    const peggedTokenBridgeV2 = getContract(peggedTokenBridgeV2Address || '', PeggedTokenBridgeV2ABI.abi, srcChainId)

    const pegConfig = getPegConfig(transferConfigs, srcChainId, dstChainId, tokenSymbol)
    const bridgeVersion = pegConfig?.bridge_version;
    const peggedTokenContact = bridgeVersion === 2 ? peggedTokenBridgeV2: peggedTokenBridge;

    console.log("1. Gateway Withdrawal liquidity request");
    requestRefund(
        rpc,
        transferId,
        ""
    );

    console.log("2. Check transfer status");
    let statusResult = await getTransferStatus(rpc, transferId);

    if(statusResult.wdOnchain) {
        let wd_onchain:any = statusResult.wdOnchain;
        let _signers = statusResult.signersList;
        let sorted_sigs = statusResult.sortedSigsList;
        let _powers = statusResult.powersList;

        console.log("2. Executing orginalvault contract withdraw");
        const wdmsg = base64.decode(wd_onchain);

        const signers = _signers.map((item: any) => {
            const decodeSigners = base64.decode(item);
            const hexlifyObj = hexlify(decodeSigners);
            return getAddress(hexlifyObj);
        });

        const sigs = sorted_sigs.map((item:any) => {
            return base64.decode(item);
        });

        const powers = _powers.map((item: any) => {
            return base64.decode(item);
        });
        console.log("3. Executing peggedbridge contract");
        let result = await transactor(
            peggedTokenContact.mint(
                wdmsg, sigs, signers, powers,
                {gasLimit: 200000 }
            ),
            srcChainId
        );

        console.log(result);
        
        console.log("Delaying for 300 seconds for checking refund confirmation status");
        await new Promise(r => setTimeout(r, 300000))

        console.log("4. Check transfer status");
        await getTransferStatus(rpc, transferId)
    } else {
        console.log("Not able to trigger contract withdraw as status info is insufficient");
    }
    
})()
