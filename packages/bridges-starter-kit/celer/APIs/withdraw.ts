
import { base64, getAddress, hexlify } from "ethers/lib/utils";

export const parseRefundTxResponse = (wdOnchain: Uint8Array | string, signersList: Array<Uint8Array | string>, sortedSigsList: Array<Uint8Array | string>, powersList: Array<Uint8Array | string>) => {
    const wdmsg = base64.decode(wdOnchain.toString());

    const signers = signersList.map(item => {
        const decodeSigners = base64.decode(item.toString());
        const hexlifyObj = hexlify(decodeSigners);
        return getAddress(hexlifyObj);
    });

    const sigs = sortedSigsList.map(item => {
        return base64.decode(item.toString());
    });

    const powers = powersList.map(item => {
        return base64.decode(item.toString());
    });

    return {
        sigs: sigs,
        powers: powers,
        signers: signers,
        wdmsg: wdmsg
    }
}

