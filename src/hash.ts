import { Buffer } from 'buffer'
import createHash from 'create-hash'

export const Sha256 = (val: string | Buffer): Buffer => {
    return createHash('sha256').update(val).digest()
}

export const Ripemd160 = (val: string | Buffer): Buffer => {
    return createHash('ripemd160').update(val).digest()
}
