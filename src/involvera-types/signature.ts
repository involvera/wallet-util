import { SECP256K1 } from '../../ext_src'
import { RandomBytes, Sha256 } from '../../ext_src/hash'
import { InvBuffer, PubKey } from './'
import { generateRandomIntRange, normalizeToUint8Array, TBufferInitializer } from './utils'

export interface IPlainSig {
    public_key: string
    signature: string
}

const isPlainSig = (signature: TBufferInitializer | IPlainSig) => {
    return signature instanceof Object && "public_key" in signature
}

export default class Signature extends InvBuffer {

    static MSG_LENGTH = 32
    static LENGTH_MIN = 64
    static LENGTH_MAX = 72

    static random = () => new Signature(RandomBytes(generateRandomIntRange(66, 72)))
    static from64 = (str: string) => new Signature(InvBuffer.from64(str))
    static from58 = (str: string) => new Signature(InvBuffer.from58(str))
    static fromHex = (str: string) => new Signature(InvBuffer.fromHex(str))
    
    static formatSignatureContent = (msg: TBufferInitializer) => {
        const nMsg = normalizeToUint8Array(msg)
        return nMsg.length === Signature.MSG_LENGTH ? nMsg : Sha256(nMsg)
    }

    static isValid = (sig: TBufferInitializer) => {
        const length = normalizeToUint8Array(sig).length
        return length >= Signature.LENGTH_MIN && length <= Signature.LENGTH_MAX
    }

    _pubk: PubKey | null = null
    constructor(signature: TBufferInitializer | IPlainSig){
        super(isPlainSig(signature) ? Signature.fromHex((signature as IPlainSig).signature).bytes() : signature as TBufferInitializer)
        if (isPlainSig(signature))
            this._pubk = PubKey.fromHex((signature as IPlainSig).public_key)
        if (!Signature.isValid(this.bytes()))
            throw new Error("wrong Signature")
    }

    copy = () => {
        if (!this._pubk)
            return new Signature(this.bytes())
        return new Signature(this.get().plain())
    }

    private throwErrorIfNotPlain = () => {
        if (!this._pubk){
            throw new Error("You can't verify/access an object as signature if the Signature Class has been instance with a uint8array as signature")
        }
    }

    get = () => {
        return {
            plain: (): IPlainSig => {
                this.throwErrorIfNotPlain()
                return {
                    public_key: this._pubk?.to().string().hex() as string,
                    signature: this.to().string().hex()
                }
            }
        }
    }
    
    verifyWithPubK = (v: TBufferInitializer, pubK: PubKey) => {
        try {
            return SECP256K1.verify(this.bytes(), Signature.formatSignatureContent(v), pubK.bytes())
        } catch (e){
            return false
        }
    }

    verify = (v: TBufferInitializer) => {
        this.throwErrorIfNotPlain()
        return this.verifyWithPubK(v, this._pubk as PubKey)
    }
}