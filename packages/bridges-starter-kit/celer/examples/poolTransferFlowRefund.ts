import { JSDOM } from "jsdom"
const { window } = new JSDOM()
global.XMLHttpRequest = window.XMLHttpRequest
import { base64, getAddress, hexlify } from "ethers/lib/utils";
import { config } from "dotenv"
config()

import { getEstimation, requestRefund, getTransferStatus, getTransferConfigs } from "../APIs"
import { getBridgeContractAddress, getContract, transactor } from "../helper"
import BridgeABI from "../contract/abi/Bridge.sol/Bridge.json"

const rpc: string = process.env.CBRIDGE_GATEWAY_URL!
const walletAddress: string = process.env.WALLET_ADDRESS!

;(async () => {
    const srcChainId = parseInt(process.env.CHAIN1_ID!);
    const tokenSymbol = process.env.TOKEN_SYMBOL!;
    const amount = process.env.AMOUNT!;
    const slippageTolerance = parseInt(process.env.SLIPPAGE_TOLERANCE!);
    const transferId = "0x6085feec485c109c7c23b2bee61b2ca3f8a78418ac859e48f088f24914a60b6d"; //Replace your transfer Id here

    const transferConfigs = await getTransferConfigs(rpc);
    const bridgeAddress = getBridgeContractAddress(transferConfigs, srcChainId)
    const bridgeContract = getContract(bridgeAddress || '', BridgeABI.abi, srcChainId)

   
    const estimated = await getEstimation(rpc, walletAddress, srcChainId, tokenSymbol, amount, slippageTolerance)
    console.log("Estimated: "+estimated);
    if (estimated) {
        console.log("1. Gateway Withdrawal liquidity request");
        requestRefund(
            rpc,
            transferId,
            estimated
        )
    } else {
        console.log("Not able to estimate");
        return;
    }

    console.log("Delaying for 50 seconds for checking refund confirmation status");
    await new Promise(r => setTimeout(r, 50000))

    console.log("2. Check status for refund to be confirmed");
    let statusResult = await getTransferStatus(rpc, transferId);

    if(statusResult.wdOnchain) {
        let wd_onchain:any = statusResult.wdOnchain;
        let _signers = statusResult.signersList;
        let sorted_sigs = statusResult.sortedSigsList;
        let _powers = statusResult.powersList;

        console.log("3. Executing cBridge contract withdraw");
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

        let result = await transactor(
            bridgeContract.withdraw(
                wdmsg, sigs, signers, powers,
                {gasLimit: 100000 }
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
