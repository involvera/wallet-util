import { InvBuffer, Address } from '.'
import { Buffer } from "../buffer"
import base58 from '../base58'

const VERSION = 0x00

export default class PublicKeyHashed extends InvBuffer {

    static from64 = (str: string) => new PublicKeyHashed(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new PublicKeyHashed(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new PublicKeyHashed(Buffer.from(str, 'hex'))

    toAddress = (): Address => {
        const pubKeyHash = this.bytes()
        const versionedPayload = Buffer.concat([Buffer.from([VERSION]), pubKeyHash])
        const chksum = Address.getChecksum(versionedPayload)
    
        const fullPayload = new PublicKeyHashed(Buffer.concat([pubKeyHash, chksum]))
        const address = fullPayload.to().string().base58()
        return new Address((VERSION+1).toString() + address)
    }
}