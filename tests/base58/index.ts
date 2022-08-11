

import 'mocha';
import { expect } from 'chai';
import base58 from '../../ext_src/base58'
import { Buffer } from '../../ext_src/buffer'
const fixtures = require('./fixtures.json')


describe('base58', () => {
  it('encode', () => {
    fixtures.valid.forEach(function (f: any) {
      const actual = base58.encode(Buffer.from(f.hex, 'hex'))
      expect(actual).to.eq(f.string)
    })
  })

  it('decode', () => {
    fixtures.valid.forEach(function (f: any) {
      const actual = Buffer.from(base58.decode(f.string)).toString('hex')
      expect(actual).to.eq(f.hex)
    })

    fixtures.invalid.forEach(function (f: any) {
      expect(() => base58.decode(f.string)).to.throw(/^Non-base58 character$/)
    })
  })
})