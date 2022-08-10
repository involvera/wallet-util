import { Buffer } from "./buffer"
import sha from './sha'
import createHmac from './sha/hmac'
import RIPEMD160 from './ripemd160'

export const Sha256 = (val: string | Buffer): Buffer => {
    return Buffer.from(sha('sha256').update(val).digest())
}

export const Sha512 = (val: string | Buffer): Buffer => {
    return Buffer.from(sha('sha512').update(val).digest())
}

export const Hmac512 = (key: Buffer, data: Buffer) => {
    return Buffer.from((createHmac('sha512', key) as any).update(data).digest())
}

export const Ripemd160 = (val: Buffer | string): Buffer => {
    return (new RIPEMD160() as any).update(val).digest()
}
