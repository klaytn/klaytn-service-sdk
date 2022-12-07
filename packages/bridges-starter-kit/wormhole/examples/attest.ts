import {
	parseSequenceFromLogEth,
	getEmitterAddressEth,
  attestFromEth,
  tryNativeToHexString,
  CHAIN_ID_KLAYTN,

} from '@certusone/wormhole-sdk';
import { Contract, providers, utils, Wallet } from "ethers"
import axios from 'axios';
let Bridge =  require('./bridge.json');
require("dotenv").config();

// Attest from Klaytn to Goerli (Works only for EVM compatible chains)

let config = {
  wormhole: {
    restAddress: 'https://wormhole-v2-testnet-api.certus.one'
  }
};

const source = {
  token: "0x0FD3f122A9B6471928B60eeE73bF35D895C4Ee01", // Token to be attested
  privatekey: process.env.PRIVATE_KEY || "",
  rpcUrl: "https://api.baobab.klaytn.net:8651",
  coreBridge: "0x1830CC6eE66c84D2F177B94D544967c774E624cA",
  tokenBridge: "0xC7A13BE098720840dEa132D860fDfa030884b09A",
  wormholeChainId: CHAIN_ID_KLAYTN
};

const destination = {
  privatekey: process.env.PRIVATE_KEY || "",
  rpcUrl: "https://ethereum-goerli-rpc.allthatnode.com",
  tokenBridge: "0xF890982f9310df57d00f659cf4fd87e65adEd8d7"
};

const sourceWallet = new Wallet(
  source.privatekey,
  new providers.JsonRpcProvider(source.rpcUrl)
);
const destinationnWallet = new Wallet(
  destination.privatekey,
  new providers.JsonRpcProvider(destination.rpcUrl)
);

(async () => {
  console.log("Registering a token");
  console.log("1. Create AttestMeta VAA ");
  const networkTokenAttestation = await attestFromEth(
    source.tokenBridge, // Token Bridge Address
    sourceWallet, //Private Key to sign and pay for TX + RPC Endpoint
    source.token //Token Address
  );

  console.log("2. Retrive VAA and sequence");
  const emitterAddr = getEmitterAddressEth(source.tokenBridge);
  const seq = parseSequenceFromLogEth(
    networkTokenAttestation,
    source.coreBridge
  );
  const vaaURL = `${config.wormhole.restAddress}/v1/signed_vaa/${source.wormholeChainId}/${emitterAddr}/${seq}`;
  console.log("Searching for: ", vaaURL);
  await new Promise((r) => setTimeout(r, 2000));
  let vaaBytes: any = await axios.get(vaaURL);
  while (!vaaBytes.data && vaaBytes.data.vaaBytes) {
    console.log("VAA not found, retrying in 5s!");
    await new Promise((r) => setTimeout(r, 5000)); //Timeout to let Guardiand pick up log and have VAA ready
    vaaBytes = await axios.get(vaaURL);
  }
  vaaBytes = vaaBytes.data;

  console.log("3. Submit the VAA onto the target chain to create a wrapped version of the token");
  const contractInterface = new utils.Interface(Bridge['abi']);
  const targetTokenBridge = new Contract(destination.tokenBridge, contractInterface, destinationnWallet)

  let wrappedTxn = await targetTokenBridge.createWrapped(
    Buffer.from(vaaBytes.vaaBytes, "base64"),
    {
      gasLimit: 2000000,
    }
  );
  console.log("Wrapped Txn: https://goerli.etherscan.io/tx/"+wrappedTxn.hash);
  await new Promise((r) => setTimeout(r, 5000)); //Time out to let block propogate
  const wrappedTokenAddress = await targetTokenBridge.wrappedAsset(
    source.wormholeChainId,
    Buffer.from(tryNativeToHexString(source.token, "ethereum"), "hex"),
    {gasLimit: 2000000 }
  );
  console.log("Wrapped token created at: ", wrappedTokenAddress);

})();