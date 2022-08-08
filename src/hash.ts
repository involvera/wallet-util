import { Buffer } from 'buffer'
import RIPEMD160 from './ripemd160'
import {sha256} from './sha256'


export const Sha256 = (val: string | Buffer): Buffer => {
    return Buffer.from(sha256.digest(val))
}

export const Ripemd160 = async (val: Buffer | string) => {
    return (new RIPEMD160() as any).update(val).digest()
}
