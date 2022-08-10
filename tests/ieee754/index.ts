
import { expect } from 'chai';
import 'mocha';
import { Buffer } from '../../src/buffer'
const ieee754 = require('../../src/ieee754')

const EPSILON = 0.00001

describe('ieee754', () => {

  it('read float', () => {
    const val = 42.42
    const buf = Buffer.alloc(4)
  
    buf.writeFloatLE(val, 0)
    const num = ieee754.read(buf, 0, true, 23, 4)
  
    expect(Math.abs(num - val) < EPSILON).to.eq(true)
  })

  it('write float', () => {
    const val = 42.42
    const buf = Buffer.alloc(4)
  
    ieee754.write(buf, val, 0, true, 23, 4)
    const num = buf.readFloatLE(0)
  
    expect(Math.abs(num - val) < EPSILON).to.eq(true)
  })

  it('read double', () => {
    const value = 12345.123456789
    const buf = Buffer.alloc(8)
  
    buf.writeDoubleLE(value, 0)
    const num = ieee754.read(buf, 0, true, 52, 8)
  
    expect(Math.abs(num - value) < EPSILON).to.eq(true)
  })

  it('write double', () => {
    const value = 12345.123456789
    const buf = Buffer.alloc(8)
  
    ieee754.write(buf, value, 0, true, 52, 8)
    const num = buf.readDoubleLE(0)
  
    expect(Math.abs(num - value) < EPSILON).to.eq(true)
  })
})
