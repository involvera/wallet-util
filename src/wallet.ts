import { Buffer } from 'buffer'
import { Ripemd160, Sha256 } from "./hash"
import { EncodeBase58, DecodeBase58 } from './base'
import * as bip39 from 'bip39'

const VERSION = 0x00
const ADDR_CHECKSUM_LENGTH = 4

export const IsValidMnemonic = (mnemonic: string): boolean => bip39.validateMnemonic(mnemonic)

export const NewMnemonic = (): string => bip39.generateMnemonic()

export const IsAddressValid = (addr: string): boolean => {
    let pubKeyHash = DecodeBase58(addr.slice(1, addr.length))
    const actualChecksum = pubKeyHash.slice(pubKeyHash.length-ADDR_CHECKSUM_LENGTH, pubKeyHash.length)
    const version = addr.charCodeAt(0) - 48 - 1
    pubKeyHash = pubKeyHash.slice(0, pubKeyHash.length - ADDR_CHECKSUM_LENGTH)

    const targetChecksum = checksum(Buffer.concat([Buffer.from([version]), pubKeyHash]))

    return Buffer.compare(actualChecksum, targetChecksum) == 0
}

export const ToPubKeyHash = (pubk: string | Buffer) => {
    return Ripemd160(Sha256(pubk))
}

export const GetAddressFromPubKeyHash = (pubKeyHash: Buffer): string => {
    const versionedPayload = Buffer.concat([Buffer.from([VERSION]), pubKeyHash])
    const chksum = checksum(versionedPayload)

    const fullPayload = Buffer.concat([pubKeyHash, chksum])
    const address = EncodeBase58(fullPayload)

    return (VERSION+1).toString() + address
}

export const PubKeyHashFromAddress = (address: string) => {
    let pubKeyHash = DecodeBase58(address.slice(1, address.length))
    return pubKeyHash.slice(0, pubKeyHash.length - ADDR_CHECKSUM_LENGTH)
}

export const ShortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}` 
}

const checksum = (payload: Buffer): Buffer => {
    const doubleSha = Sha256(Sha256(payload))
    return doubleSha.slice(0, ADDR_CHECKSUM_LENGTH)
}
