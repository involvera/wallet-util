import { InvBigInt, ArrayInvBigInt, PubKH as PublicKeyHashed, PubKey as PublicKey } from './'
import { TIntType } from './bigint'
import { decodeInt } from './utils'
import { Hash } from '../../ext_src'

const { 
    BytesToBase58,
    BytesToBase64,
    Base58ToBytes,
    Base64ToBytes,
    HexToBytes,
    BytesToHex,
    UTF8ToBytes,
} = Hash

export class InvBuffer {

    static fromRaw = (str: string) => new InvBuffer(UTF8ToBytes(str))
    static fromNumber = (n: number, intType: TIntType) => new InvBigInt(BigInt(n)).to().bytes(intType)
    static from64 = (str: string) => new InvBuffer(Base64ToBytes(str))
    static from58 = (str: string) => new InvBuffer(Base58ToBytes(str))
    static fromHex = (str: string) => new InvBuffer(HexToBytes(str))

    private buffer: Uint8Array
    constructor(buffer: Uint8Array | number[]){
        this.buffer = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)

    }

    to = () =>  {
        const int = (isNegative: boolean | void) => new InvBigInt(decodeInt(this.bytes(), !!isNegative))
        
        const string = () => {
            return {
                raw: () => this.toString(),
                hex: () => BytesToHex(this.bytes()),
                base64: () => BytesToBase64(this.bytes()),
                base58: () => BytesToBase58(this.bytes())
            }
        }     

        return {
            int, 
            string,
        }   
    }

    bytes = () => this.buffer

    format = () => {
        return {
            pubKH: () => new PublicKeyHashed(this.bytes()),
            pubK: () => new PublicKey(this.bytes())        
        }
    }
}

export class ArrayInvBuffer extends Array<InvBuffer> {

    static fromNumbers = (list: number[], intType: TIntType) => list.map((n: number) => InvBuffer.fromNumber(n, intType))
    static from64 = (list: string[]) => list.map((str: string) => InvBuffer.from64(str))
    static from58 = (list: string[]) => list.map((str: string) => InvBuffer.from58(str))
    static fromHex = (list: string[]) =>list.map((str: string) => InvBuffer.fromHex(str))

    totalLength = () => {
        let count: number = 0;
        for (let b of this)
            count += b.bytes().length
        return count
    }

    toArrayHex = () => this.map((v: InvBuffer) => v.to().string().hex())
    toArrayBase64 = () => this.map((v: InvBuffer) => v.to().string().base64())
    toArrayBigInt = () => {
        const ret = new ArrayInvBigInt(0)
        ret.push(...this.map((v: InvBuffer) => v.to().int()))
        return ret
    }
    toDoubleUInt8Array = () => this.map((v: InvBuffer) => v.bytes())
}


