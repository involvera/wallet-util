import { Buffer } from "../ext_src"

const MAX_UINT_8 = BigInt(256)
const MAX_UINT_16 = BigInt(65536)
const MAX_UINT_32 = BigInt(4294967296)
const MAX_UINT_64 = BigInt(18446744073709551616)

const TWO = BigInt(2)
const ONE = BigInt(1)
const ZERO = BigInt(0)
const MINUS = BigInt(-1)

export const ToArrayBufferFromB64 = (arr: string[]): Buffer[] => {
    let ret: Buffer[] = []
    for (let i = 0; i < arr.length; i++){
        ret.push(Buffer.from(arr[i], 'base64'))
    }
    return ret
}

export const B64ToBigInt = (b64: string, isNegative: boolean): BigInt => {
    return DecodeInt(B64ToByteArray(b64), isNegative)
}

export const B64ToByteArray = (b64: string): Buffer => {
    return Buffer.from(b64, 'base64')
}

export const DoubleByteArrayToB64Array = (array: Buffer[]): string[] => {
    const ret: string[] = []
    for (let b of array)
        ret.push(ByteArrayToB64(b))
    return ret
}

export const ByteArrayToB64 = (b: Buffer): string => {
    return b.toString('base64')
}
