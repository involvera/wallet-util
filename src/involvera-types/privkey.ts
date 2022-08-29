import { BIP32, SECP256K1 } from '../../ext_src'
import { RandomBytes } from '../../ext_src/hash'
import {InvBuffer, PubKey, Signature} from './'
import { normalizeToUint8Array } from './utils'

export default class PrivateKey {

    static random = () => new PrivateKey(BIP32.fromMasterSeed(RandomBytes(64)))
    static fromBase58 = (base58Wallet: string) => new PrivateKey(BIP32.fromExtendedKey(base58Wallet))

    private _key: BIP32
    constructor(key: BIP32){
        if (!key.privateKey){
            throw new Error("Not a private key")
        }
        this._key = key
    }

    get = () => this._key

    bytes = () => new InvBuffer(this.get().privateKey as Uint8Array)
    publicKey = () => new PubKey(this.get().publicKey as Uint8Array)
    toBase58 = () => this.get().privateExtendedKey
    derive = (path: string) => new PrivateKey(this.get().derive(path))
    sign = (v: Uint8Array | InvBuffer | string) => {
        const signature = SECP256K1.signSync(Signature.formatSignatureContent(v), this.get().privateKey as Uint8Array)

        return new Signature({
            public_key: this.publicKey().hex(),
            signature: new InvBuffer(signature).hex()
        })
    }

}
