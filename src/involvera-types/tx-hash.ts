import { RandomBytes } from '../../ext_src/hash'
import { InvBuffer } from './'
import { normalizeToUint8Array } from './utils'

export default class TxHash extends InvBuffer {

    static LENGTH = 32
    static random = () => new TxHash(RandomBytes(TxHash.LENGTH))
    static from64 = (str: string) => new TxHash(InvBuffer.from64(str))
    static from58 = (str: string) => new TxHash(InvBuffer.from58(str))
    static fromHex = (str: string) => new TxHash(InvBuffer.fromHex(str))
    static isValid = (txHash: string | InvBuffer | Uint8Array) => normalizeToUint8Array(txHash).length === TxHash.LENGTH

    constructor(b: InvBuffer | Uint8Array){
        super(normalizeToUint8Array(b))
        if (!TxHash.isValid(b)){
            throw new Error("Invalid transaction hash")
        }
    }
}