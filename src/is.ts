import { Buffer } from "../ext_src"


export const IsTxHashRightFormat = (hash: Buffer) => {
    return hash.length === 32
}