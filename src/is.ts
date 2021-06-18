export const IsPubKHRightFormat = (pubkh: Buffer) => {
    return pubkh.length === 20
}

export const IsTxHashRightFormat = (hash: Buffer) => {
    return hash.length === 32
}

export const IsUUID = (uuid: string) => { 
    return uuid.indexOf('-') >= 0
}