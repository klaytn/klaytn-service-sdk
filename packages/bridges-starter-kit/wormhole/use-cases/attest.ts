import {
	parseSequenceFromLogEth,
	getEmitterAddressEth,
  attestFromEth,
  tryNativeToHexString,
  CHAINS
} from '../core';
import { Contract, providers, utils, Wallet } from "ethers"
import axios from 'axios';
let Bridge =  require('../core/abi/bridge.json');

// Attest a token from Source chain to Destination chain (Works only for EVM compatible chains)

export async function attest(
    config:{ wormhole: { restAddress: string }},
    source: {
      token: string, // Token to be attested
      privatekey: string,
      rpcUrl: string,
      coreBridge: string,
      tokenBridge: string,
      wormholeChainId: string },
    destination: {
      privatekey: string,
      rpcUrl: string,
      tokenBridge: string,
      wormholeChainId: string }
): Promise<string> {

  console.log("Registering a token");
// inits
  const sourceWallet = new Wallet(
      source.privatekey,
      new providers.JsonRpcProvider(source.rpcUrl)
  );
  const destinationnWallet = new Wallet(
      destination.privatekey,
      new providers.JsonRpcProvider(destination.rpcUrl)
  );
  let CHAINSBYID = Object.entries(CHAINS).reduce((acc:any, curr:any) => {
    acc[curr[1].toString()] = { name: curr[0].toString(), chainId: curr[1] };
    return acc;
  }, {});

  console.log("1. Create AttestMeta VAA ");
  const networkTokenAttestation = await attestFromEth(
    source.tokenBridge, // Token Bridge Address
    sourceWallet, //Private Key to sign and pay for TX + RPC Endpoint
    source.token //Token Address
  );

  await new Promise((r) => setTimeout(r, 2000));
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
  console.log("Wrapped Transaction on Destination chain: "+wrappedTxn.hash);
  await new Promise((r) => setTimeout(r, 5000)); //Time out to let block propagate
  const wrappedTokenAddress = await targetTokenBridge.wrappedAsset(
    source.wormholeChainId,
    Buffer.from(tryNativeToHexString(source.token, CHAINSBYID[destination.wormholeChainId].name), "hex"),
    {gasLimit: 2000000 }
  );
  console.log("Wrapped token on destination chain created at: ", wrappedTokenAddress);
  return wrappedTokenAddress;

}
