import { InvBigInt } from "./involvera-types"

export const CalculateOutputValueFromMelted = (meltedAmount: number, meltedRatio: number): InvBigInt => {
    return new InvBigInt(Math.ceil(meltedAmount / meltedRatio))
}

export const CalculateOutputMeltedValue = (amount: BigInt, meltedRatio: number): InvBigInt => {
    /* 
        The value owned by an UTXO can excess the 2^53 limit of JS for precision, but once divided by 2 it can't.
        So we divide the value by 2 to get the right precision, because the maximum value for an output value is between 2^53 & 2^54.
        Then we add it back at the end because the maximum value for a melted output is < 2^53
    */
    const DIVIDER = 2
    const safeNumberValueInt = BigInt(amount as any) / BigInt(DIVIDER as any)
    const nStr = amount.toString()
    const isLastNumberOdd = parseInt(nStr[nStr.length-1]) % 2 == 1
    const rest = isLastNumberOdd ? (1 * meltedRatio) : 0

    return new InvBigInt(Math.floor(((Number(safeNumberValueInt) * meltedRatio) * DIVIDER) + rest))
}