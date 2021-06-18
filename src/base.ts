const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const BASEUUID = '1234567890abcdefghijkmnopqrstuvwxyz'
const bs58 = require('base-x')(BASE58)
const bUUID = require('base-x')(BASEUUID)

export const DecodeBase58 = (data: string): Buffer => bs58.decode(data)
export const EncodeBase58 = (data: Buffer): string => bs58.encode(data)
export const EncodeBaseUUID = (data: Buffer): string => {
    const based = bUUID.encode(data)
    const ret = based.slice(0, 8) + '-' + based.slice(8, 12) + '-' + based.slice(12, 16) + '-' + based.slice(16, 20) + '-' + based.slice(20, 32)
    return ret
}

export const DecodeBaseUUID = (data: string): Buffer => {
    const str = data.slice(0, 8) + data.slice(9, 13) + data.slice(14, 18) + data.slice(19, 23) + data.slice(24, 36)
    const ret = bUUID.decode(str)
    return ret
}
