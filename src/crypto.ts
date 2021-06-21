import * as bip32 from 'bip32'
import { ec as EC } from 'elliptic'
const ec = new EC('secp256k1');

export interface ISignatureHex {
    public_key_hex: string
    signature_hex: string
}

export const BuildSignatureHex = (wallet: bip32.BIP32Interface, value: Buffer): ISignatureHex => {
    const priv = wallet.privateKey as Buffer
    const pub = wallet.publicKey
    const sig = Buffer.from(ec.sign(value, priv).toDER()).toString('hex')
    return {
        public_key_hex: pub.toString('hex'),
        signature_hex: sig
    }
}

export const BuildSignature = (private_key: Buffer, value: Buffer): Buffer => Buffer.from(ec.sign(value, private_key).toDER())

export const VerifySignatureHex = (sig: ISignatureHex, value: Buffer): boolean => {
    try {
        const res = ec.verify(value, Buffer.from(sig.signature_hex as string, 'hex'), Buffer.from(sig.public_key_hex as string, 'hex'))
        return res
    } catch (e){
        return false
    }
}

export const VerifySignature = (value: Buffer, signature: Buffer, public_key: Buffer): boolean => {
    try {
        const res = ec.verify(value, signature, public_key)
        return res
    } catch (e){
        return false
    }
}