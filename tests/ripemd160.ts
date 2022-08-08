'use strict'

import { expect } from 'chai';
import 'mocha';
var vectors = require('hash-test-vectors')
import { Buffer } from 'buffer'

var RIPEMD160 = require('../src/ripemd160')
  describe('ripemd160', () => {
    vectors.forEach(function (vector: any, i:any) {
      var input = new Buffer(vector.input, 'base64')

      it('vector #' + (i + 1) + ' with .update', () => {
        expect(new RIPEMD160().update(input).digest('hex')).to.eq(vector.ripemd160)
      })

      it('vector #' + (i + 1) + ' with streams', () => { 
        var hash = new RIPEMD160()
        hash.end(input)
        expect(hash.read().toString('hex')).to.eq(vector.ripemd160)
      })
    })
})