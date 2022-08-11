import { expect } from 'chai';
import 'mocha';

var vectors = require('hash-test-vectors')
var Buffer = require('../../ext_src/safe-buffer').Buffer

var createHash = require('../../ext_src/sha')

const makeTest = (alg: string) => {
  vectors.forEach(function (v: any, i: any) {

    it(alg + ': NIST vector ' + i, () => {
      var buf = Buffer.from(v.input, 'base64')
      expect(createHash(alg).update(buf).digest('hex')).to.eq(v[alg])

      i = ~~(buf.length / 2)
      var buf1 = buf.slice(0, i)
      var buf2 = buf.slice(i, buf.length)
  
      expect(createHash(alg)
          .update(buf1)
          .update(buf2)
          .digest('hex'),
      ).to.eq(v[alg])



    var j, buf3: any

    i = ~~(buf.length / 3)
    j = ~~(buf.length * 2 / 3)
    buf1 = buf.slice(0, i)
    buf2 = buf.slice(i, j)
    buf3 = buf.slice(j, buf.length)

    expect(createHash(alg)
        .update(buf1)
        .update(buf2)
        .update(buf3)
        .digest('hex')
    ).to.eq(v[alg])
    })
  })
}

describe('sha testing', () => {
  makeTest('sha')
  makeTest('sha1')
  makeTest('sha224')
  makeTest('sha256')
  makeTest('sha384')
  makeTest('sha512')
})
