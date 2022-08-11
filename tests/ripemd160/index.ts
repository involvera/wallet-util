'use strict'

import { expect } from 'chai';
import 'mocha';
var vectors = require('hash-test-vectors')
import { Buffer } from '../../ext_src/buffer'
var RIPEMD160 = require('../../ext_src/ripemd160')

describe('ripemd160', () => {
    vectors.forEach(function (vector: any, i:any) {
      var input = Buffer.from(vector.input, 'base64')

      it('vector #' + (i + 1) + ' with .update', () => {
        expect((new RIPEMD160() as any).update(input).digest().toString('hex')).to.eq(vector.ripemd160)
      })
    })
})