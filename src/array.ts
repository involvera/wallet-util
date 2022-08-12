export const NewIntArrayFilled = (length: number, from: number): number[] => {
    let ret: number[] = []
    for (let i =0; i < length; i++){
        ret[i] = from + i
    }
    return ret
}
