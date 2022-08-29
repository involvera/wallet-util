import { InvBigInt, ArrayInvBigInt, PubKH as PublicKeyHashed, PubKey as PublicKey, Signature, TxHash } from './'
import { TIntType } from './bigint'
import { decodeInt, normalizeToUint8Array, TBufferInitializer } from './utils'
import { Hash } from '../../ext_src'
import { ConcatBytes } from '../../ext_src/hash'

const { 
    BytesToBase58,
    BytesToBase64,
    Base58ToBytes,
    Base64ToBytes,
    HexToBytes,
    BytesToHex,
    UTF8ToBytes,
    BytesToUTF8
} = Hash

export class InvBuffer {

    static FromUint8s = (...arrays: Uint8Array[]) => new InvBuffer(ConcatBytes(...arrays))
    static FromStrings = (...arrays: string[]) => InvBuffer.FromUint8s(...(arrays.map((s:string) => InvBuffer.fromRaw(s).bytes())))

    static fromRaw = (str: string) => new InvBuffer(UTF8ToBytes(str))
    static fromNumber = (n: number, intType: TIntType) => new InvBigInt(BigInt(n)).to().bytes(intType)
    static from64 = (str: string) => new InvBuffer(Base64ToBytes(str))
    static from58 = (str: string) => new InvBuffer(Base58ToBytes(str))
    static fromHex = (str: string) => new InvBuffer(HexToBytes(str))

    private buffer: Uint8Array
    constructor(buffer: TBufferInitializer){
        this.buffer = normalizeToUint8Array(buffer)

    }

    to = () =>  {
        const big = () => new InvBigInt(BigInt(`0x` + this.hex()))
        const int = (isNegative: boolean | void) => new InvBigInt(decodeInt(this.bytes(), !!isNegative))
        
        const string = () => {
            return {
                raw: (): string => BytesToUTF8(this.bytes()),
                hex: () => BytesToHex(this.bytes()),
                base64: () => BytesToBase64(this.bytes()),
                base58: () => BytesToBase58(this.bytes())
            }
        }     

        return {
            int, 
            big,
            string,
        }   
    }

    eq = (buffer: TBufferInitializer) => new InvBuffer(normalizeToUint8Array(buffer)).to().string().raw() ===this.to().string().raw()
    length = () => this.bytes().length
    bytes = () => this.buffer
    hex = this.to().string().hex
    base64 = this.to().string().base64
    toString = this.to().string().raw
    int = this.to().int
    big = this.to().big

    format = () => {
        return {
            pubKH: () => new PublicKeyHashed(this.bytes()),
            pubK: () => new PublicKey(this.bytes()), 
            signature: () => new Signature(this.bytes()),
            txHash: () => new TxHash(this.bytes())
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


