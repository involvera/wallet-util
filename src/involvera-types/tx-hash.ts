import { InvBuffer } from '.'
import { Buffer, base58 } from "../../ext_src"

export default class TxHash extends InvBuffer {

    static from64 = (str: string) => new TxHash(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new TxHash(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new TxHash(Buffer.from(str, 'hex'))

    static isRightFormat = (txHash: string | Buffer) => txHash.length === 32
}