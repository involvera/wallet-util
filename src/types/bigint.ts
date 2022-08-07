import { EncodeInt, EncodeInt64 } from "../bytes"
import { InvBuffer } from '.'

class InvBigInt {

    static from64 = (base64: string, isNegative: boolean) => InvBuffer.from64(base64).to().int(isNegative)
    static fromHex = (hex: string, isNegative: boolean) => InvBuffer.fromHex(hex).to().int(isNegative)

    private _v: BigInt
    constructor(i: BigInt){
        this._v = i
    }

    big = () => this._v

    to = () => {
        return {
            int: () => new InvBuffer(EncodeInt(this._v)),
            int64: () => new InvBuffer(EncodeInt64(this._v))
        }
    }
}

export default InvBigInt