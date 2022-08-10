

import 'mocha';
import { expect } from 'chai';

var createBlakeHash = require('blake-hash')
var bs58checkBase = require('../../src/base58check/base')

function blake256x2 (buffer: Buffer) {
  buffer = createBlakeHash('blake256').update(buffer as any).digest()
  return createBlakeHash('blake256').update(buffer as any).digest()
}

var bs58check = bs58checkBase(blake256x2)
it('custom checksum function (blake256x2)', () => {
    const address = 'DsRLWShUQexhKE1yRdpe2kVH7fmULcEUFDk'
    const payload = Buffer.from('073f0415e993935a68154fda7018b887c4e3fe8b4e10', 'hex')
  
    expect(bs58check.encode(payload, blake256x2)).to.eq(address)
    expect(bs58check.decodeUnsafe(address, blake256x2)).to.eq(payload)
    expect(bs58check.decode(address, blake256x2)).to.eq(payload)
})
