import * as bip32 from 'bip32'
import { Buffer } from 'buffer'
import { Signature, PubKey, InvBuffer } from '.'

import { ec as EC } from 'elliptic'
const ec = new EC('secp256k1');

export default class PrivateKey {

    static fromBase58 = (base58Wallet: string) => new PrivateKey(bip32.fromBase58(base58Wallet))

    private _key: bip32.BIP32Interface
    constructor(key: bip32.BIP32Interface){
        if (!key.privateKey){
            throw new Error("Not a private key")
        }
        this._key = key
    }

    private get = () => this._key

    bytes = () => this.get().privateKey as Buffer
    publicKey = () => new PubKey(this.get().publicKey)
    toBase58 = () => this.get().toBase58()
    derive = (path: string) => this.get().derivePath(path)

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
                signature: Buffer.from(ec.sign(value, this.bytes()).toDER()).toString('hex')
        })
    }

}
