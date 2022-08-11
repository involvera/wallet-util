import { InvBuffer, Address } from '.'
import { Buffer, base58 } from "../../ext_src"

const VERSION = 0x00

export default class PublicKeyHashed extends InvBuffer {

    static from64 = (str: string) => new PublicKeyHashed(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new PublicKeyHashed(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new PublicKeyHashed(Buffer.from(str, 'hex'))

    static isRightFormat = (pubkh: string | Buffer) => pubkh.length === 20

    toAddress = (): Address => {
        const pubKeyHash = this.bytes()
        const versionedPayload = Buffer.concat([Buffer.from([VERSION]), pubKeyHash])
        const chksum = Address.getChecksum(versionedPayload)
    
        const fullPayload = new PublicKeyHashed(Buffer.concat([pubKeyHash, chksum]))
        const address = fullPayload.to().string().base58()
        return new Address((VERSION+1).toString() + address)
    }
}