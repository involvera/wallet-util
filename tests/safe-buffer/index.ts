/* eslint-disable node/no-deprecated-api, no-var */


import { expect } from 'chai';
import 'mocha';
var SafeBuffer = require('../../ext_src/safe-buffer').Buffer
import { Buffer } from '../../ext_src/buffer'

describe('Safe Buffer', () => {
    
    it('new SafeBuffer(value) works just like Buffer', () => {

    expect(new SafeBuffer('hey')).to.deep.eq(new Buffer('hey'))
    expect(new SafeBuffer('hey', 'utf8')).to.deep.eq(new Buffer('hey', 'utf8'))
    expect(new SafeBuffer('686579', 'hex')).to.deep.eq( new Buffer('686579', 'hex'))
    expect(new SafeBuffer([1, 2, 3])).to.deep.eq( new Buffer([1, 2, 3]))
    expect(new SafeBuffer(new Uint8Array([1, 2, 3]))).to.deep.eq( new Buffer(new Uint8Array([1, 2, 3])))

    expect(typeof SafeBuffer.isBuffer).to.eq('function')
    expect(SafeBuffer.isBuffer(new SafeBuffer('hey'))).to.eq( true)
    expect(Buffer.isBuffer(new SafeBuffer('hey'))).to.eq( true)
    expect(SafeBuffer.isBuffer({})).to.not.ok
    })

    it('SafeBuffer.from(value) converts to a Buffer', () =>  {
    expect(SafeBuffer.from('hey')).to.deep.eq( new Buffer('hey'))
    expect(SafeBuffer.from('hey', 'utf8')).to.deep.eq( new Buffer('hey', 'utf8'))
    expect(SafeBuffer.from('686579', 'hex')).to.deep.eq( new Buffer('686579', 'hex'))
    expect(SafeBuffer.from([1, 2, 3])).to.deep.eq( new Buffer([1, 2, 3]))
    expect(SafeBuffer.from(new Uint8Array([1, 2, 3]))).to.deep.eq( new Buffer(new Uint8Array([1, 2, 3])))
    })

    it('SafeBuffer.alloc(number) returns zeroed-out memory', () => {
    for (var i = 0; i < 10; i++) {
        var expected1 = new Buffer(1000)
        expected1.fill(0)
        expect(SafeBuffer.alloc(1000)).to.deep.eq(expected1)

        var expected2 = new Buffer(1000 * 1000)
        expected2.fill(0)
        expect(SafeBuffer.alloc(1000 * 1000)).to.deep.eq( expected2)
    }
    })

    it('SafeBuffer.allocUnsafe(number)', () => {
        var buf = SafeBuffer.allocUnsafe(100) // unitialized memory
        expect(buf.length).to.eq(100)
        expect(SafeBuffer.isBuffer(buf)).to.eq( true)
        expect(Buffer.isBuffer(buf)).to.eq( true)
    })

    it('SafeBuffer.from() throws with number types', () => {
        expect(() => SafeBuffer.from(0)).to.Throw(Error)
        expect(() => SafeBuffer.from(-1)).to.Throw(Error)
        expect(() => SafeBuffer.from(NaN)).to.Throw(Error)
        expect(() => SafeBuffer.from(Infinity)).to.Throw(Error)
        expect(() => SafeBuffer.from(99)).to.Throw(Error)
    })

    it('SafeBuffer.allocUnsafe() throws with non-number types', () => {
        expect(() => SafeBuffer.allocUnsafe('hey')).to.Throw(Error)
        expect(() => SafeBuffer.allocUnsafe('hey', 'utf8')).to.Throw(Error)
        expect(() => SafeBuffer.allocUnsafe([1,2,3])).to.Throw(Error)
        expect(() => SafeBuffer.allocUnsafe({})).to.Throw(Error)
    })

    it('SafeBuffer.alloc() throws with non-number types', () => {
        expect(() => SafeBuffer.allocUnsafe('hey')).to.Throw(Error)
        expect(() => SafeBuffer.allocUnsafe('hey', 'utf8')).to.Throw(Error)
        expect(() => SafeBuffer.allocUnsafe([1,2,3])).to.Throw(Error)
        expect(() => SafeBuffer.allocUnsafe({})).to.Throw(Error)
    })

    it('SafeBuffer.alloc() throws with non-number types', () => {
        expect(() => SafeBuffer.alloc('hey')).to.Throw(Error)
        expect(() => SafeBuffer.alloc('hey', 'utf8')).to.Throw(Error)
        expect(() => SafeBuffer.alloc([1,2,3])).to.Throw(Error)
        expect(() => SafeBuffer.alloc({})).to.Throw(Error)
    })


})