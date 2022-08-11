import { Buffer } from '../../ext_src'
import { InvBuffer } from '.'

const MAX_UINT_8 = BigInt(256)
const MAX_UINT_16 = BigInt(65536)
const MAX_UINT_32 = BigInt(4294967296)
const MAX_UINT_64 = BigInt(18446744073709551616)

const TWO = BigInt(2)
const ONE = BigInt(1)
const ZERO = BigInt(0)
const MINUS = BigInt(-1)

const intToByteArray = (val: BigInt, valType: 'int8' | 'int16' | 'int32' | 'int64', isUnsigned: boolean): Buffer => {
    const M = {'int8': MAX_UINT_8, 'int16': MAX_UINT_16, 'int32': MAX_UINT_32, 'int64': MAX_UINT_64}[valType]
    const N_BYTE = {'int8': 8, 'int16': 16, 'int32': 32, 'int64': 64}[valType]
    const CURRENT_MIN_INT = (M / TWO) * MINUS
    const CURRENT_MAX_INT = (M / TWO) - ONE

     if (!isUnsigned && (val < CURRENT_MIN_INT || val > CURRENT_MAX_INT)){
        throw new Error("overflow")
    } else if (isUnsigned && (val < ZERO || val > ((CURRENT_MAX_INT * TWO) + ONE))){
        throw new Error("unsigned overflow")
    }

    if (val < ZERO) {
        val = ((CURRENT_MAX_INT+ONE) * TWO) + BigInt(val as any)
    }

    let binary = val.toString(2);
    const length = N_BYTE - binary.length
    for (var i = 0; i < length; i++){
        binary = `0${binary}`
    }

    let ret: number[] = []
    i = 0;
    while (i < binary.length){
        ret.push(parseInt(binary.substr(i, 8), 2))
        i += 8
    }
    return Buffer.from(ret.reverse())
}

class InvBigInt {

    static from64 = (base64: string, isUnsigned: boolean | void) => InvBuffer.from64(base64).to().int(isUnsigned)
    static fromHex = (hex: string, isUnsigned: boolean | void) => InvBuffer.fromHex(hex).to().int(isUnsigned)
    static fromNumber = (n: number) => new InvBigInt(BigInt(n))

    private _v: BigInt
    constructor(i: BigInt){
        this._v = i
    }

    big = () => this._v

    to = () => {
        return {
            int8: () => new InvBuffer(intToByteArray(this._v, 'int8', false)),
            int16: () => new InvBuffer(intToByteArray(this._v, 'int16', false)),
            int32: () => new InvBuffer(intToByteArray(this._v, 'int32', false)),
            int64: () => new InvBuffer(intToByteArray(this._v, 'int64', false)),

            unsignedInt8: () => new InvBuffer(intToByteArray(this._v, 'int8', true)),
            unsignedInt16: () => new InvBuffer(intToByteArray(this._v, 'int16', true)),
            unsignedInt32: () => new InvBuffer(intToByteArray(this._v, 'int32', true)),
            unsignedInt64: () => new InvBuffer(intToByteArray(this._v, 'int64', true)),
        }
    }
}

// class ArrayInvBigInt extends Array {

//     static from64 = (str: string[]) => {
        
//         new InvBuffer(Buffer.from(str, 'base64'))
//     }
//     static from58 = (str: string[]) => new InvBuffer(Buffer.from(base58.decode(str)))
//     static fromHex = (str: string[]) => new InvBuffer(Buffer.from(str, 'hex'))

//     private _v: InvBigInt[] = []
//     constructor(i: InvBigInt[]){
//         super(0)
//         this._v = i
//     }
    

// }


export default InvBigInt