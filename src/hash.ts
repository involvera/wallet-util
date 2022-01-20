import { Buffer } from 'buffer'
import createHash from 'create-hash'
import { DecodeBaseUUID, EncodeBaseUUID } from './base'

export const Sha256 = (val: string | Buffer): Buffer => {
    return createHash('sha256').update(val).digest()
}

export const Ripemd160 = (val: string | Buffer): Buffer => {
    return createHash('ripemd160').update(val).digest()
}

export const PubKeyHashHexToUUID = (pkhhex: string): string => {
    return EncodeBaseUUID(Buffer.from(pkhhex, 'hex'))
}
export const UUIDToPubKeyHashHex = (uuid: string): string => {
    const b = DecodeBaseUUID(uuid)
    return b.toString('hex')
}