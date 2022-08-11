import { BIP32, Buffer, BIP32Interface } from '../../ext_src'
import { Signature, PubKey, InvBuffer } from '.'


export default class PrivateKey {

    static fromBase58 = (base58Wallet: string) => new PrivateKey(BIP32.fromBase58(base58Wallet))

    private _key: BIP32Interface
    constructor(key: BIP32Interface){
        if (!key.privateKey){
            throw new Error("Not a private key")
        }
        this._key = key
    }

    private get = () => this._key

    bytes = () => this.get().privateKey as Buffer
    publicKey = () => new PubKey(this.get().publicKey)
    toBase58 = () => this.get().toBase58()
    derive = (path: string) => new PrivateKey(this.get().derivePath(path))

    sign = (v: Buffer | InvBuffer | string) => {
        let value: Buffer
        if (typeof v === 'string')
            value = Buffer.from(v)
        else if (v instanceof InvBuffer)
            value = v.bytes()
        else
            value = v
            
        return new Signature({
            public_key: this.publicKey().to().string().hex(),
            signature: this.get().sign(value).toString('hex')
        })
    }

}
