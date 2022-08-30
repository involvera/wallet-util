import { InvBuffer, ArrayInvBuffer } from './'
import { 
    intToByteArray, TStrictIntType,
} from './utils'

export type TIntType = 'int8' | 'int16' | 'int32' | 'int64' | 'uint8' | 'uint16' | 'uint32' | 'uint64'

const isUnsigned = (t: TIntType) => t.indexOf('u') === 0
const toStrictIntType = (t: TIntType): TStrictIntType => isUnsigned(t) ? (t.substring(1) as TStrictIntType) : t as TStrictIntType

export class InvBigInt {

    static normalize = (n: number | InvBigInt | BigInt) => {
        if (n instanceof InvBigInt)
            return n
        return new InvBigInt(n)

    }

    static from64 = (base64: string, isUnsigned: boolean | void) => InvBuffer.from64(base64).to().int(isUnsigned)
    static fromHex = (hex: string, isUnsigned: boolean | void) => InvBuffer.fromHex(hex).to().int(isUnsigned)
    static fromNumber = (n: number) => new InvBigInt(BigInt(n))

    private _v: BigInt
    constructor(i: BigInt | number | bigint){
        this._v = typeof i === 'number' ? BigInt(i) : i
    }

    big = () => this._v
    number = () => Number(this._v)
    bytes = (valtype: TIntType) => this.to().bytes(valtype)

    eq = (n: number | InvBigInt | BigInt) => InvBigInt.normalize(n).big() === this.big()
    gt = (n: number | InvBigInt | BigInt) => InvBigInt.normalize(n).big() < this.big()
    gte = (n: number | InvBigInt | BigInt) => this.eq(n) || this.gt(n)
    lw = (n: number | InvBigInt | BigInt) => InvBigInt.normalize(n).big() > this.big()
    lwe = (n: number | InvBigInt | BigInt) =>  this.eq(n) || this.lw(n)
    add = (n: number | InvBigInt | BigInt) => {
        this._v = this._v.valueOf() + InvBigInt.normalize(n).big().valueOf()
        return this
    }
    sub = (n: number | InvBigInt | BigInt) => {
        this._v = this._v.valueOf() - InvBigInt.normalize(n).big().valueOf()
        return this
    }
    mod = (n: number | InvBigInt | BigInt) => {
        this._v = this._v.valueOf() % InvBigInt.normalize(n).big().valueOf()
        return this
    }
    div = (n: number | InvBigInt | BigInt) => {
        this._v = this._v.valueOf() / InvBigInt.normalize(n).big().valueOf()
        return this
    }
    mul = (n: number | InvBigInt | BigInt) => {
        this._v = this._v.valueOf() * InvBigInt.normalize(n).big().valueOf()
        return this
    }

    to = () => {
        const bytes = (valtype: TIntType) => new InvBuffer(intToByteArray(this._v, toStrictIntType(valtype), isUnsigned(valtype)))

        const string = (valtype: TIntType) => bytes(valtype).to().string()

        return {
            bytes,
            string
        }
    }

    base64 = (valtype: TIntType) => this.to().string(valtype).base64()
    hex = (valtype: TIntType) => this.to().string(valtype).hex()
    toString = (valtype: TIntType) => this.to().string(valtype).raw()
}

export class ArrayInvBigInt extends Array<InvBigInt> {

    static fromNumbers = (list: number[]) => {
        const ret = new ArrayInvBigInt(0)
        for (let n of list){
            ret.push(new InvBigInt(BigInt(n)))
        }
        return ret
    }

    static from64 = (arrayBase64: string[], isUnsigned: boolean | void): ArrayInvBigInt => {
        const ret = new ArrayInvBigInt(0)
        for (let str of arrayBase64){
            ret.push(InvBigInt.from64(str, isUnsigned))
        }
        return ret
    }

    static fromHex = (arrayHex: string[], isUnsigned: boolean | void): ArrayInvBigInt => {
        const ret = new ArrayInvBigInt(0)
        for (let str of arrayHex){
            ret.push(InvBigInt.fromHex(str, isUnsigned))
        }
        return ret
    }

    isIn = (n: InvBigInt | BigInt | Number) => {
        let formated: InvBigInt
        if (typeof n === 'number')
            formated = InvBigInt.fromNumber(n)
        else if (typeof n === 'bigint')
            formated = new InvBigInt(n)
        else 
            formated = n as InvBigInt
            
        for (let e of this){
            if (e.big() === formated.big())
                return true
        }
        return false
    }

    toArrayNumber = () => this.map((v: InvBigInt) => v.number())
    toArrayBuffer = (valtype: TIntType) => {
        const ret = new ArrayInvBuffer(0)
        ret.push(...this.map((v: InvBigInt) => v.to().bytes(valtype)))
        return ret
    }
    toArrayHex = (valtype: TIntType) => this.map((v: InvBigInt) => v.to().string(valtype).hex())
    toArrayBase64 = (valtype: TIntType) => this.map((v: InvBigInt) => v.to().string(valtype).base64())
}
