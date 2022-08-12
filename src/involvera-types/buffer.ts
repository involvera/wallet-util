import { base58, Buffer } from '../../ext_src/'
import { InvBigInt, PubKey as PublicKey, PubKH as PublicKeyHashed, ArrayInvBigInt } from '.'
import { TIntType } from './bigint'
import { decodeInt } from './utils'

export class InvBuffer extends Buffer {

    static fromNumber = (n: number, intType: TIntType) => new InvBigInt(BigInt(n)).to().buffer().int(intType)
    static from64 = (str: string) => new InvBuffer(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new InvBuffer(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new InvBuffer(Buffer.from(str, 'hex'))

    to = () =>  {
        const int = (isNegative: boolean | void) => new InvBigInt(decodeInt(this, !!isNegative))
        
        const string = () => {
            return {
                raw: () => this.toString(),
                hex: () => this.toString('hex'),
                base64: () => this.toString('base64'),
                base58: () => base58.encode(this)
            }
        }     

        return {
            int, 
            string,
        }   
    }

    format = () => {
        return {
            pubKH: () => new PublicKeyHashed(this),
            pubK: () => new PublicKey(this),
            buffer: () => this as Buffer
        }
    }
}

export class ArrayInvBuffer extends Array<InvBuffer> {

    static fromNumbers = (list: number[], intType: TIntType) => {
        const ret = new ArrayInvBuffer(0)
        for (let n of list){
            ret.push(new InvBigInt(BigInt(n)).to().buffer().int(intType))
        }
        return ret
    }
    
    static from64 = (list: string[]) => {
        const ret = new ArrayInvBuffer(0)
        for (let str of list){
            ret.push(new InvBuffer(Buffer.from(str, 'base64')))
        }
        return ret
    }

    static from58 = (list: string[]) => {
        const ret = new ArrayInvBuffer(0)
        for (let str of list){
            ret.push(new InvBuffer(Buffer.from(base58.decode(str))))
        }
        return ret
    }

    static fromHex = (list: string[]) => {
        const ret = new ArrayInvBuffer(0)
        for (let str of list){
            ret.push(new InvBuffer(Buffer.from(str, 'hex')))
        }
        return ret
    }

    totalLength = () => {
        let count: number = 0;
        for (let b of this)
            count += b.length
        return count
    }

    toArrayHex = () => this.map((v: InvBuffer) => v.to().string().hex())
    toArrayBase64 = () => this.map((v: InvBuffer) => v.to().string().base64())
    toArrayBigInt = () => {
        const ret = new ArrayInvBigInt(0)
        ret.push(...this.map((v: InvBuffer) => v.to().int()))
        return ret
    }
    toArrayBuffer = () => this.map((v: InvBuffer) => v.format().buffer())
}


