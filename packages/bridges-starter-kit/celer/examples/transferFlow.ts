import { JSDOM } from 'jsdom';
const { window } = new JSDOM();
global.XMLHttpRequest = window.XMLHttpRequest;
import { config } from "dotenv";
config();
// import estimateAmt request message 
import { 
  EstimateAmtRequest,
  GetTransferStatusRequest,
} from "../ts-proto/gateway/gateway_pb";

// import grpc-web WebClient
import { 
  WebClient 
} from "../ts-proto/gateway/GatewayServiceClientPb";

import { bridge, transactor, getTransferId, getTransferStatus } from '../helper';
import { safeParseUnits } from "celer-web-utils/lib/format";
import { BigNumber } from "@ethersproject/bignumber";

const address = process.env.WALLET_ADDRESS || '';

const estimateRequest = new EstimateAmtRequest();
estimateRequest.setSrcChainId(8217);
estimateRequest.setDstChainId(56);
estimateRequest.setTokenSymbol("USDT");
estimateRequest.setUsrAddr(address);
estimateRequest.setSlippageTolerance(3000);
estimateRequest.setAmt("100000");

const client = new WebClient(process.env.CBRIDGE_GATEWAY_URL || '', null, null);

(async() => {
  const estimateAmount = await client.estimateAmt(estimateRequest, null);
  const isNativeToken = false;

  //USDT on Klaytn mainnet
  const transferToken = {
    "token": {
      "symbol": "USDT",
      "address": "0x3c790b38f466514ffCB4230e7B2334e52B64c942",
      "decimal": 6,
      "xfer_disabled": true
    },
    "name": "Tether USD (Celer)",
    "icon": "https://get.celer.app/cbridge-icons/USDT.png",
    "inbound_lmt": "",
    "inbound_epoch_cap": "",
    "transfer_disabled": false,
    "liq_add_disabled": false,
    "liq_rm_disabled": false,
    "liq_agg_rm_src_disabled": false
  };

  //Klaytn mainnet
  const fromChain = {
    id: 8217,
    name: "Klaytn",
    icon: "https://get.celer.app/cbridge-icons/chain-icon/klaytn.png",
    block_delay: 30,
    gas_token_symbol: "KLAY",
    explore_url: "https://www.klaytnfinder.io/",
    contract_addr: "0x4C882ec256823eE773B25b414d36F92ef58a7c0C",
    drop_gas_amt: "0",
    drop_gas_cost_amt: "0",
    drop_gas_balance_alert: "0",
    suggested_gas_cost: "0",
    flat_usd_fee: 0,
    farming_reward_contract_addr: ""
  };

  //BNB mainnet
  const toChain = {
    "id": 56,
    "name": "BNB Chain",
    "icon": "https://get.celer.app/cbridge-icons/chain-icon/BNB-chain.png",
    "block_delay": 8,
    "gas_token_symbol": "BNB",
    "explore_url": "https://bscscan.com/",
    "contract_addr": "0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF",
    "drop_gas_amt": "0",
    "drop_gas_cost_amt": "0",
    "drop_gas_balance_alert": "0",
    "suggested_gas_cost": "151000",
    "flat_usd_fee": 0.2,
    "farming_reward_contract_addr": ""
  };

  const value = safeParseUnits("10000", transferToken?.token?.decimal ?? 18);
  const nonce = new Date().getTime();

  const transferId = getTransferId(address, transferToken?.token?.address, value, toChain.id, nonce, fromChain.id);
  console.log(`-TransferId:`, transferId);

  try {
    await transactor(
      isNativeToken
        ? bridge.sendNative(
            address,
            value,
            BigNumber.from(toChain?.id),
            BigNumber.from(nonce),
            BigNumber.from(estimateAmount.getMaxSlippage() || 0),
            { value },
          )
        : bridge.send(
            address,
            transferToken?.token?.address,
            value,
            BigNumber.from(toChain?.id),
            BigNumber.from(nonce),
            BigNumber.from(estimateAmount.getMaxSlippage() || 0),
          ),
    );
  } catch (error: any) {
    console.log(`-Error:`, error.error.error.error.message);
  }
  await getTransferStatus(client, transferId);
})()
