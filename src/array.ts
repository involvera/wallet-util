import { Buffer } from 'buffer'

export const NewIntArrayFilled = (length: number, from: number): number[] => {
    let ret: number[] = []
    for (let i =0; i < length; i++){
        ret[i] = from + i
    }
    return ret
}

export const IsInNumberArray = (array: number[], n: number) => {
    for (let e of array){
        if (e == n)
            return true
    }
    return false
}

export const CalcTotalLengthDoubleByteArray = (array: Buffer[]) => {
    let total = array.length
    for (let e of array){
        total += e.length
    }
    return total
}