import { InvBuffer } from '.'
import { Buffer, base58 } from "../../ext_src"

export default class TxHash extends InvBuffer {

    static LENGTH = 32

    static from64 = (str: string) => new TxHash(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new TxHash(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new TxHash(Buffer.from(str, 'hex'))
    static isValid = (txHash: string | Buffer) => txHash.length === TxHash.LENGTH

    constructor(b: Buffer){
        super(b)
        if (!TxHash.isValid(b)){
            throw new Error("Invalid transaction hash")
        }
    }

}