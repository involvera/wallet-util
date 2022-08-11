import { Buffer } from "./buffer"
import xorshift from './xorshift'
import sha from './sha'
import createHmac from './sha/hmac'
import RIPEMD160 from './ripemd160'

export const Sha256 = (val: string | Buffer): Buffer => {
    return Buffer.from(sha('sha256').update(val).digest())
}

export const Sha512 = (val: string | Buffer): Buffer => {
    return Buffer.from(sha('sha512').update(val).digest())
}

export const CreateHmac = (alg: string, key: Buffer, data: Buffer) => {
    return Buffer.from((createHmac(alg, key) as any).update(data).digest())
}

export const Hmac512 = (key: Buffer, data: Buffer) => {
    return CreateHmac('sha512', key, data)
}

export const Ripemd160 = (val: Buffer | string): Buffer => {
    return (new RIPEMD160() as any).update(val).digest()
}

export const RandomBytes = (n: number) => {
    if (n < 0){
        throw new Error("can't be negative")
    }
    const ret: number[] = []
    for (let i = 0; i < n; i++){
        const r = xorshift.random()
        ret.push(Math.floor(r * 255))
    }
    return new Buffer(new Uint8Array(ret))
}