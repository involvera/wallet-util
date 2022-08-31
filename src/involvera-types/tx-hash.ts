import { RandomBytes, Sha256 } from '../../ext_src/hash'
import { InvBuffer } from './'
import { normalizeToUint8Array, TBufferInitializer } from './utils'

export default class TxHash extends InvBuffer {

    static LENGTH = 64
    static fromUnHashed = (unhashed: TBufferInitializer) => new TxHash(Sha256(normalizeToUint8Array(unhashed)))
    static random = () => new TxHash(RandomBytes(TxHash.LENGTH))
    static from64 = (str: string) => new TxHash(InvBuffer.from64(str))
    static from58 = (str: string) => new TxHash(InvBuffer.from58(str))
    static fromHex = (str: string) => new TxHash(InvBuffer.fromHex(str))
    static isValid = (txHash: TBufferInitializer) => normalizeToUint8Array(txHash).length === TxHash.LENGTH

    constructor(b: TBufferInitializer){
        super(b)
        if (!TxHash.isValid(b)){
            throw new Error("Invalid transaction hash")
        }
    }
}