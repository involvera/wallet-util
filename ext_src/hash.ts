import XorShift from './xorshift'
import { hmac } from './hashes/src/hmac'
import { ripemd160 } from './hashes/src/ripemd160'
import { sha256 } from './hashes/src/sha256'
import { sha512 } from './hashes/src/sha512'
import { bytesToHex, toBytes, concatBytes, hexToBytes, u8, u32 } from './hashes/src/utils'
import { base58, base64 } from './base'

export const Sha256 = (val: string | Uint8Array): Uint8Array => sha256(val)

export const Sha512 = (val: string | Uint8Array): Uint8Array => sha512(val)

export const Hmac512 = (key: Uint8Array | string, data: Uint8Array | string) => hmac(sha512, key, data);

export const Hmac256 = (key: Uint8Array | string, data: Uint8Array | string) => hmac(sha256, key, data);

export const Ripemd160 = (val: string | Uint8Array): Uint8Array => ripemd160(val)

export const RandomBytes = (n: number) => {
    if (n < 0){
        throw new Error("can't be negative")
    }
    const ret: number[] = []
    for (let i = 0; i < n; i++){
        const r = XorShift.random()
        ret.push(Math.floor(r * 255))
    }
    return new Uint8Array(ret)
}

export const BytesToBase58 = (bytes: Uint8Array) => base58.encode(bytes)
export const Base58ToBytes = (str: string) => base58.decode(str)

export const BytesToBase64 = (bytes: Uint8Array) => base64.encode(bytes)
export const Base64ToBytes = (str: string) => base64.decode(str)

export const BytesToHex = bytesToHex
export const HexToBytes = hexToBytes

export const UTF8ToBytes = toBytes
declare const TextDecoder: any;
export const BytesToUTF8 = (bytes: Uint8Array) => new TextDecoder().decode(bytes);

export const ConcatBytes = concatBytes
export const CastToUint8Array = u8
export const CastToUint32Array = u32
