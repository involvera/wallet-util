import { InvBuffer, Address } from './'
import { ConcatBytes, RandomBytes } from '../../ext_src/hash'
import { normalizeToUint8Array } from './utils'

const VERSION = 0x00
export default class PublicKeyHashed extends InvBuffer {

    static LENGTH = 20
    static random = () => new PublicKeyHashed(RandomBytes(PublicKeyHashed.LENGTH))

    static from64 = (str: string) => new PublicKeyHashed(InvBuffer.from64(str))
    static from58 = (str: string) => new PublicKeyHashed(InvBuffer.from58(str))
    static fromHex = (str: string) => new PublicKeyHashed(InvBuffer.fromHex(str))

    static isValid = (pubkh: InvBuffer | Uint8Array) => normalizeToUint8Array(pubkh).length === PublicKeyHashed.LENGTH

    constructor(b: InvBuffer | Uint8Array){
        super(normalizeToUint8Array(b))
        if (!PublicKeyHashed.isValid(b)){
            throw new Error("Invalid public key hashed")
        }
    }

    t = (b: InvBuffer | Uint8Array) => {
        return new InvBuffer(normalizeToUint8Array(b))
    }

    toAddress = (): Address => {
        const pubKeyHash = this.bytes().slice()
        const versionedPayload = ConcatBytes(new Uint8Array([VERSION]), pubKeyHash)
        const chksum = Address.getChecksum(versionedPayload)
    
        const fullPayload = ConcatBytes(pubKeyHash, chksum)
        const address = new InvBuffer(fullPayload).to().string().base58()

        return new Address((VERSION+1).toString() + address)
    }
}