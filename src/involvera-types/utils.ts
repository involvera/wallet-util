import { Buffer } from "../../ext_src" 
export const MAX_UINT_8 = BigInt(256)
export const MAX_UINT_16 = BigInt(65536)
export const MAX_UINT_32 = BigInt(4294967296)
export const MAX_UINT_64 = BigInt(18446744073709551616)

export const TWO = BigInt(2)
export const ONE = BigInt(1)
export const ZERO = BigInt(0)
export const MINUS = BigInt(-1)

export type TStrictIntType = 'int8' | 'int16' | 'int32' | 'int64'

export const intToByteArray = (val: BigInt, valType: TStrictIntType, isUnsigned: boolean): Buffer => {
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


export const decodeInt = (value: Buffer, isNegative: boolean): BigInt => {
    let n = BigInt(0);
    let MAX = MAX_UINT_8
    switch(value.length){
        case 1:
            MAX = MAX_UINT_8
            break;
        case 2:
            MAX = MAX_UINT_16
            break;
        case 4:
            MAX = MAX_UINT_32
            break;
        case 8:
            MAX = MAX_UINT_64
            break;
    }

    const readBigUInt64LE = (buffer: Buffer, offset = 0) => {
        const first = buffer[offset];
        const last = buffer[offset + 7];
        if (first === undefined || last === undefined) {
          throw new Error('Out of bounds');
        }
      
        const lo = first +
          buffer[++offset] * 2 ** 8 +
          buffer[++offset] * 2 ** 16 +
          buffer[++offset] * 2 ** 24;
      
        const hi = buffer[++offset] +
          buffer[++offset] * 2 ** 8 +
          buffer[++offset] * 2 ** 16 +
          last * 2 ** 24;
      
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
    }

    if (value.length == 8) {
        n = readBigUInt64LE(Buffer.from(value), 0)
    } else {
        switch (value.length){
            case 4:
                n = BigInt(Buffer.from(value).readUInt32LE(0))
                break;
            case 2:
                n = BigInt(Buffer.from(value).readUInt16LE(0))
                break;
            case 1:
                n = BigInt(value[0])
                break;

        }
    }
    return isNegative ? n - MAX : n
}