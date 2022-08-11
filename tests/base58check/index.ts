import 'mocha';
import { expect } from 'chai';
import bs58check from '../../src/base58check/index'
var fixtures = require('./fixtures.json')
var Buffer = require('../../src/safe-buffer').Buffer

// require('./base')
describe('base58check', () => {
    fixtures.valid.forEach((f: any) => {
        it('decodes ' + f.string, () => {
            var actual = new Buffer(bs58check.decode(f.string)).toString('hex')
            expect(actual).to.eq(f.payload)
        
            actual = new Buffer(bs58check.decodeUnsafe(f.string)).toString('hex')
            expect(actual).to.eq(f.payload)
        })
    })

    fixtures.invalid.forEach((f: any) => {
        it('decode throws on ' + f.string, () => {
            expect(() =>{
                bs58check.decode(f.string)
            }).to.throw(new RegExp(f.exception))
        })
        expect(bs58check.decodeUnsafe(f.string)).to.eq(undefined)
    })

    fixtures.valid.forEach((f: any) => {
        var actual = bs58check.encode(Buffer.from(f.payload, 'hex'))
        expect(actual).to.eq(f.string)
    })
})