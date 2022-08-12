import { InvBuffer, PubKH } from '.'
import { Buffer, Hash, base58 } from "../../ext_src"
const { Ripemd160, Sha256 } = Hash

export default class PublicKey extends InvBuffer {
    
    static LENGTH = 33
    static from64 = (str: string) => new PublicKey(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new PublicKey(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new PublicKey(Buffer.from(str, 'hex'))
    static isValid = (pubk: string | Buffer) => pubk.length === PublicKey.LENGTH

    constructor(b: Buffer){
        super(b)
        if (!PublicKey.isValid(b)){
            throw new Error("Invalid public key")
        }
    }

    hash = async () => new PubKH(await Ripemd160(Sha256(this)))
}
