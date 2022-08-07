import { InvBuffer, PubKH } from '.'
import { Buffer } from 'buffer'
import { Ripemd160, Sha256 } from '../hash'
import base58 from '../base58'

export default class PublicKey extends InvBuffer {
    static from64 = (str: string) => new PublicKey(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new PublicKey(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new PublicKey(Buffer.from(str, 'hex'))

    hash = () => new PubKH(Ripemd160(Sha256(this.bytes())))
}
