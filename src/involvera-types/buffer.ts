import { base58, Buffer } from '../../ext_src/'
import { InvBigInt, PubKey as PublicKey, PubKH as PublicKeyHashed } from '.'

const MAX_UINT_8 = BigInt(256)
const MAX_UINT_16 = BigInt(65536)
const MAX_UINT_32 = BigInt(4294967296)
const MAX_UINT_64 = BigInt(18446744073709551616)

const decodeInt = (value: Buffer, isNegative: boolean): BigInt => {
    let n = BigInt(0);
    let MAX = MAX_UINT_8
    switch(value.length){
        case 1:
            MAX = MAX_UINT_8
            break;
        case 2:
            MAX = MAX_UINT_16
            break;
        case 4:
            MAX = MAX_UINT_32
            break;
        case 8:
            MAX = MAX_UINT_64
            break;
    }

    const readBigUInt64LE = (buffer: Buffer, offset = 0) => {
        const first = buffer[offset];
        const last = buffer[offset + 7];
        if (first === undefined || last === undefined) {
          throw new Error('Out of bounds');
        }
      
        const lo = first +
          buffer[++offset] * 2 ** 8 +
          buffer[++offset] * 2 ** 16 +
          buffer[++offset] * 2 ** 24;
      
        const hi = buffer[++offset] +
          buffer[++offset] * 2 ** 8 +
          buffer[++offset] * 2 ** 16 +
          last * 2 ** 24;
      
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
    }

    if (value.length == 8) {
        n = readBigUInt64LE(Buffer.from(value), 0)
    } else {
        switch (value.length){
            case 4:
                n = BigInt(Buffer.from(value).readUInt32LE(0))
                break;
            case 2:
                n = BigInt(Buffer.from(value).readUInt16LE(0))
                break;
            case 1:
                n = BigInt(value[0])
                break;

        }
    }
    return isNegative ? n - MAX : n
}


class InvBuffer {

    static from64 = (str: string) => new InvBuffer(Buffer.from(str, 'base64'))
    static from58 = (str: string) => new InvBuffer(Buffer.from(base58.decode(str)))
    static fromHex = (str: string) => new InvBuffer(Buffer.from(str, 'hex'))

    private _v: Buffer
    constructor(s: Buffer){
        this._v = s
    }

    to = () =>  {
        const int = (isUnsigned: void | boolean) => new InvBigInt(decodeInt(this.bytes(), !!isUnsigned))

        const string = () => {
            return {
                raw: () => this.bytes().toString(),
                hex: () => this.bytes().toString('hex'),
                base64: () => this.bytes().toString('base64'),
                base58: () => base58.encode(this.bytes())
            }
        }     

        return {
            int, 
            string
        }   
    }

    format = () => {
        return {
            pubKH: () => new PublicKeyHashed(this._v),
            pubK: () => new PublicKey(this._v)
        }
    }

    public bytes = () => this._v
}

// class ArrayInvBuffer {
//     private _v: InvBuffer[] = []
//     constructor(s: InvBuffer[] = []){
//         this._v = s
//     }
// }




export default InvBuffer