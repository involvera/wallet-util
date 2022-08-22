import { InvBuffer, PubKH } from './'
import { Sha256, ConcatBytes } from "../../ext_src/hash"

const ADDR_CHECKSUM_LENGTH = 4

export default class Address {

    static getChecksum = (payload: Uint8Array): Uint8Array => {
        const doubleSha = Sha256(Sha256(payload))
        return doubleSha.slice(0, ADDR_CHECKSUM_LENGTH)
    }

    static isValid = (addr: string) => {
        let pubKeyHash = InvBuffer.from58(addr.slice(1, addr.length)).bytes()
        const actualChecksum = pubKeyHash.slice(pubKeyHash.length-ADDR_CHECKSUM_LENGTH, pubKeyHash.length)
        const version = addr.charCodeAt(0) - 48 - 1
        pubKeyHash = pubKeyHash.slice(0, pubKeyHash.length - ADDR_CHECKSUM_LENGTH)
        const targetChecksum = Address.getChecksum(ConcatBytes(new Uint8Array([version]), pubKeyHash))

        return actualChecksum.toString() === targetChecksum.toString()
    }

    private _adr: string
    constructor(address: string){
        if (!Address.isValid(address)){
            throw new Error("Invalid address")
        }
        this._adr = address
    }

    shorten = () => `${this.get().slice(0, 6)}...${this.get().slice(this.get().length - 6, this.get().length)}` 

    get = () => this._adr
    toPKH = () => {
        const address = this.get()
        const pkh = InvBuffer.from58(address.slice(1, address.length)).bytes()
        return new PubKH(pkh.slice(0, pkh.length - ADDR_CHECKSUM_LENGTH))
    }
}