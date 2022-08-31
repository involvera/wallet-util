import { InvBigInt } from "./involvera-types"

export const CalculateOutputValueFromMelted = (meltedAmount: InvBigInt, meltedRatio: number): InvBigInt => {
    return InvBigInt.ceil(meltedAmount.divDecimals(meltedRatio))
}

export const CalculateOutputMeltedValue = (amount: InvBigInt, meltedRatio: number): InvBigInt => {
    return new InvBigInt(amount.mulDecimals(meltedRatio))
}