import {InvBuffer, PubKH} from './'
import { Ripemd160, Sha256  } from "../../ext_src/hash"
import { normalizeToUint8Array } from './utils'

export default class PublicKey extends InvBuffer {
    
    static LENGTH = 33
    static from64 = (str: string) => new PublicKey(InvBuffer.from64(str))
    static from58 = (str: string) => new PublicKey(InvBuffer.from58(str))
    static fromHex = (str: string) => new PublicKey(InvBuffer.fromHex(str))
    static isValid = (pubk: InvBuffer | Uint8Array) => normalizeToUint8Array(pubk).length === PublicKey.LENGTH

    constructor(b: InvBuffer | Uint8Array){
        super(normalizeToUint8Array(b))
        if (!PublicKey.isValid(b)){
            throw new Error("Invalid public key")
        }
    }

    po = () => {
        return 4
    }

    hash = () => new PubKH(Ripemd160(Sha256(this.bytes())))
}
