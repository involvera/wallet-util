import { Buffer } from '../buffer' 
import { Ripemd160, Sha256, Hmac512 } from "../hash";

export function hash160(buffer: Buffer): Buffer {
    const sha256Hash = Sha256(buffer)
    return Ripemd160(sha256Hash)
}

export function hmacSHA512(key: Buffer, data: Buffer): Buffer {
    return Hmac512(key, data)
}