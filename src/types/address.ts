import { Sha256 } from '../hash'
import { PubKH } from '.'

const ADDR_CHECKSUM_LENGTH = 4

export default class Address {

    static getChecksum = (payload: Buffer): Buffer => {
        const doubleSha = Sha256(Sha256(payload))
        return doubleSha.slice(0, ADDR_CHECKSUM_LENGTH)
    }

    static isValid = (addr: string) => {
        let pubKeyHash = PubKH.from58(addr.slice(1, addr.length))
        const actualChecksum = pubKeyHash.bytes().slice(pubKeyHash.bytes().length-ADDR_CHECKSUM_LENGTH, pubKeyHash.bytes().length)
        const version = addr.charCodeAt(0) - 48 - 1
        pubKeyHash = new PubKH(pubKeyHash.bytes().slice(0, pubKeyHash.bytes().length - ADDR_CHECKSUM_LENGTH))
    
        const targetChecksum = Address.getChecksum(Buffer.concat([Buffer.from([version]), pubKeyHash.bytes()]))
    
        return Buffer.compare(actualChecksum, targetChecksum) == 0
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
        const pkh = PubKH.from58(address.slice(1, address.length))
        return new PubKH(pkh.bytes().slice(0, pkh.bytes().length - ADDR_CHECKSUM_LENGTH))
    }
}