import { bigInt } from 'fast-check'
import { InvBuffer, ArrayInvBuffer } from './'
import BigDecimal from './bigdecimal'
import { 
    intToByteArray, TStrictIntType, normalizeNumberToString
} from './utils'

export type BigIntType = number | InvBigInt | BigInt | string
export type TIntType = 'int8' | 'int16' | 'int32' | 'int64' | 'uint8' | 'uint16' | 'uint32' | 'uint64'

const isUnsigned = (t: TIntType) => t.indexOf('u') === 0
const toStrictIntType = (t: TIntType): TStrictIntType => isUnsigned(t) ? (t.substring(1) as TStrictIntType) : t as TStrictIntType

export class InvBigInt {

    static ceil = (n: BigIntType) => {
        const ret = new InvBigInt(n)
        let mustIncrement = false
        if (typeof n === 'string'){
            const sp = n.split('.')
            if (sp[1]){
                for (let c of sp[1]){
                    if (parseInt(c) != 0){
                        mustIncrement = true
                        break
                    }
                }
            }
        }
        if (typeof n === 'number')
            mustIncrement = n % 1 !== 0
        if (mustIncrement)
            ret.addEq(1)
        return ret
    }

    static from64 = (base64: string, isNegative: boolean | void) => InvBuffer.from64(base64).to().int(isNegative)
    static fromHex = (hex: string, isNegative: boolean | void) => InvBuffer.fromHex(hex).to().int(isNegative)

    private _v: BigInt
    constructor(i: BigIntType){
        if (typeof i === 'number')
            i = i.toString()
        if (i instanceof InvBigInt){
            this._v = i.big()
        } else if (typeof i === 'string'){
            if (/0[xX][0-9a-fA-F]+/.test(i))
                this._v = BigInt(i)
            else 
                this._v = BigInt(i.split('.')[0])
        } else 
            this._v = i        
    }

    big = () => this._v
    number = () => Number(this._v)
    bytes = (valtype: TIntType) => this.to().bytes(valtype)
    string = () => this._v.toString()

    eq = (n: BigIntType) => new InvBigInt(n).big() === this.big()
    gt = (n: BigIntType) => new InvBigInt(n).big() < this.big()
    lw = (n: BigIntType) => new InvBigInt(n).big() > this.big()
    gte = (n: BigIntType) => this.eq(n) || this.gt(n)
    lwe = (n: BigIntType) =>  this.eq(n) || this.lw(n)

    add = (n: BigIntType) => new InvBigInt(this._v.valueOf() + new InvBigInt(n).big().valueOf())
    sub = (n: BigIntType) => new InvBigInt(this._v.valueOf() - new InvBigInt(n).big().valueOf())
    mod = (n: BigIntType) => new InvBigInt(this._v.valueOf() % new InvBigInt(n).big().valueOf())
    div = (n: BigIntType) => new InvBigInt(this._v.valueOf() / new InvBigInt(n).big().valueOf())
    mul = (n: BigIntType) => new InvBigInt(this._v.valueOf() * new InvBigInt(n).big().valueOf())

    addEq = (n: BigIntType) => {
        this._v = this.add(n).big()
        return this
    }
    subEq = (n: BigIntType) => {
        this._v = this.sub(n).big()
        return this
    }
    modEq = (n: BigIntType) => {
        this._v = this.mod(n).big()
        return this
    }
    divEq = (n: BigIntType) => {
        this._v = this.div(n).big()
        return this
    }
    mulEq = (n: BigIntType) => {
        this._v = this.mul(n).big()
        return this
    }

    divDecimals = (n: BigIntType): string => {
        var a = new BigDecimal(this.big().toString());
        return a.divide(normalizeNumberToString(n)).toString()
    }

    mulDecimals = (n: BigIntType): string => {
        var a = new BigDecimal(this.big().toString());
        return a.multiply(normalizeNumberToString(n)).toString()
    }

    addDecimals = (n: BigIntType): string => {
        var a = new BigDecimal(this.big().toString());
        return a.add(normalizeNumberToString(n)).toString()
    }

    subDecimals = (n: BigIntType): string => {
        var a = new BigDecimal(this.big().toString());
        return a.subtract(normalizeNumberToString(n)).toString()
    }
    
    min = (n: BigIntType) => {
        if (this.lw(n))
            return this
        return new InvBigInt(n)
    }

    max = (n: BigIntType) => {
        if (this.gt(n))
            return this
        return new InvBigInt(n)
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
            formated = new InvBigInt(n)
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
