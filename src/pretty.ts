export const FormatVPPercent = (percent: number) => {
    const microTreatment = (percent: number, fixed: number): number | string =>{
        const p = percent.toFixed(fixed)
        if (p[p.length-1] === '0' && fixed > 0)
            return microTreatment(parseFloat(p.slice(0, p.length-1)), fixed-1)
        return p
    }
    
    if (percent < 0.001)
        return '<0.001%'
    if (percent < 1)
        return microTreatment(percent, 3) + '%'
    if (percent < 10)
        return microTreatment(percent, 2) + '%'
    if (percent < 100)
        return microTreatment(percent, 1) + '%'
    return percent + '%'
}