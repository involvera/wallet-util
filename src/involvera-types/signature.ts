import * as ec from 'tiny-secp256k1'
import { Buffer, base58 } from "../../ext_src"
import { InvBuffer, PubKey } from '.'

export interface IPlainSig {
    public_key: string
    signature: string
}

export default class Signature extends InvBuffer {

    static from64 = (str: string) => new Signature(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new Signature(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new Signature(Buffer.from(str, 'hex'))

    _pubk: PubKey | null = null
    constructor(signature: Buffer | IPlainSig){
        super(Buffer.isBuffer(signature) ? signature as Buffer : Signature.fromHex(signature.signature))
        if (!Buffer.isBuffer(signature))
            this._pubk = PubKey.fromHex(signature.public_key)
    }

    private throwErrorIfNotPlain = () => {
        if (!this._pubk){
            throw new Error("You can't verify/access an object as signature if the Signature Class has been instance with a buffer as signature")
        }
    }

    get = () => {
        return {
            plain: (): IPlainSig => {
                this.throwErrorIfNotPlain()
                return {
                    public_key: this._pubk?.to().string().hex() as string,
                    signature: this.toString('hex')
                }
            }
        }
    }
    
    verifyWithPubK = (v: InvBuffer | Buffer | string, pubK: PubKey) => {
        let value: Buffer
        if (typeof v === 'string')
            value = Buffer.from(v)
        else
            value = v

        
        try {
            return ec.verify(value, pubK, this)
        } catch (e){
            return false
        }
    }

    verify = (v: InvBuffer | Buffer | string) => {
        this.throwErrorIfNotPlain()
        return this.verifyWithPubK(v, this._pubk as PubKey)
    }
}