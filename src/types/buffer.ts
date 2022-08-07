import { Buffer } from "buffer"
import base58 from '../base58'
import { DecodeInt } from "../bytes"
import { InvBigInt, PubKey as PublicKey, PubKH as PublicKeyHashed } from '.'

class InvBuffer {

    static from64 = (str: string) => new InvBuffer(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new InvBuffer(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new InvBuffer(Buffer.from(str, 'hex'))

    private _v: Buffer
    constructor(s: Buffer){
        this._v = s
    }

    to = () =>  {
        const int = (isNegative: boolean) => new InvBigInt(DecodeInt(this.bytes(), isNegative))

        const string = () => {
            return {
                raw: () => this.bytes().toString(),
                hex: () => this.bytes().toString('hex'),
                base64: () => this.bytes().toString('base64'),
                base58: () => base58.encode(this.bytes())
            }
        }     

        return {
            int, 
            string
        }   
    }

    format = () => {
        return {
            pubKH: () => new PublicKeyHashed(this._v),
            pubK: () => new PublicKey(this._v)
        }
    }

    public bytes = () => this._v
}

export default InvBuffer