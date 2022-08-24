import { SECP256K1 } from '../../ext_src'
import { RandomBytes, Sha256 } from '../../ext_src/hash'
import { InvBuffer, PubKey } from './'
import { generateRandomIntRange, normalizeToUint8Array } from './utils'

export interface IPlainSig {
    public_key: string
    signature: string
}

export default class Signature extends InvBuffer {

    static MSG_LENGTH = 32
    static LENGTH_MIN = 64
    static LENGTH_MAX = 72


    static random = () => new Signature(RandomBytes(generateRandomIntRange(66, 72)))
    static from64 = (str: string) => new Signature(InvBuffer.from64(str))
    static from58 = (str: string) => new Signature(InvBuffer.from58(str))
    static fromHex = (str: string) => new Signature(InvBuffer.fromHex(str))
    
    static formatSignatureContent = (msg: InvBuffer | Uint8Array | string) => {
        const nMsg = normalizeToUint8Array(msg)
        return nMsg.length === Signature.MSG_LENGTH ? nMsg : Sha256(nMsg)
    }

    static isValid = (sig: InvBuffer | Uint8Array | Signature) => {
        const length = (sig instanceof Uint8Array) ? sig.length : sig.bytes().length
        return length >= Signature.LENGTH_MIN && length <= Signature.LENGTH_MAX
    }


    _pubk: PubKey | null = null
    constructor(signature: InvBuffer | IPlainSig | Uint8Array){
        super(signature instanceof InvBuffer || signature instanceof Uint8Array ? normalizeToUint8Array(signature) : Signature.fromHex(signature.signature).bytes())
        if (!(signature instanceof InvBuffer || signature instanceof Uint8Array))
            this._pubk = PubKey.fromHex(signature.public_key)
        if (!Signature.isValid(this.bytes())){
            throw new Error("Signature")
        }
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
    
    verifyWithPubK = (v: InvBuffer | Uint8Array | string, pubK: PubKey) => {
        try {
            return SECP256K1.verify(this.bytes(), Signature.formatSignatureContent(v), pubK.bytes())
        } catch (e){
            return false
        }
    }

    verify = (v: InvBuffer | Uint8Array | string) => {
        this.throwErrorIfNotPlain()
        return this.verifyWithPubK(v, this._pubk as PubKey)
    }
}