import { Buffer } from 'buffer'
import createHash from 'create-hash'
import {sha256} from './sha256'


export const Sha256 = (val: string | Buffer): Buffer => {
    return Buffer.from(sha256.digest(val))
    // return createHash('sha256').update(val).digest()
}

export const Ripemd160 = (val: string | Buffer): Buffer => {
    return createHash('ripemd160').update(val).digest()
}
