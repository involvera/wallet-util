import {InvBuffer, PubKH} from './'
import { RandomBytes, Ripemd160, Sha256  } from "../../ext_src/hash"
import { normalizeToUint8Array, TBufferInitializer } from './utils'

export default class PublicKey extends InvBuffer {
    
    static LENGTH = 33
    static random = () => new PublicKey(RandomBytes(PublicKey.LENGTH))

    static from64 = (str: string) => new PublicKey(InvBuffer.from64(str))
    static from58 = (str: string) => new PublicKey(InvBuffer.from58(str))
    static fromHex = (str: string) => new PublicKey(InvBuffer.fromHex(str))
    static isValid = (pubk: TBufferInitializer) => normalizeToUint8Array(pubk).length === PublicKey.LENGTH

    constructor(b: TBufferInitializer){
        super(b)
        if (!PublicKey.isValid(this.bytes())){
            throw new Error("Invalid public key")
        }
    }

    copy = () => new PublicKey(this.bytes())
    hash = () => new PubKH(Ripemd160(Sha256(this.bytes())))
}
