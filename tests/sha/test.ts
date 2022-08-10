import crypto from 'crypto'
import { expect } from 'chai';
import 'mocha';


var Sha1 = require('../../src/sha').sha1
var Buffer = require('../../src/safe-buffer').Buffer

var inputs = [
  ['', 'ascii'],
  ['abc', 'ascii'],
  ['123', 'ascii'],
  ['123456789abcdef123456789abcdef123456789abcdef123456789abcdef', 'ascii'],
  ['123456789abcdef123456789abcdef123456789abcdef123456789abc', 'ascii'],
  ['123456789abcdef123456789abcdef123456789abcdef123456789ab', 'ascii'],
  ['0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcde', 'ascii'],
  ['0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'ascii'],
  ['foobarbaz', 'ascii']
]

it("hash is the same as node's crypto", () => {
  inputs.forEach(function (v: any) {
    var a = new Sha1().update(v[0], v[1]).digest('hex')
    var e = crypto.createHash('sha1').update(v[0], v[1]).digest('hex')
    expect(a).to.eq(e)
  })
})

it("call update multiple times", () => {
  inputs.forEach(function (v: any) {
    var hash = new Sha1()
    var _hash = crypto.createHash('sha1')

    for (var i = 0; i < v[0].length; i = (i + 1) * 2) {
      var s = v[0].substring(i, (i + 1) * 2)
      hash.update(s, v[1])
      _hash.update(s, v[1])
    }

    var a = hash.digest('hex')
    var e = _hash.digest('hex')
    expect(a).to.eq(e)
  })
})

it("call update twice", () => {
  var _hash = crypto.createHash('sha1')
  var hash = new Sha1()

  _hash.update('foo', 'ascii')
  hash.update('foo', 'ascii')

  _hash.update('bar', 'ascii')
  hash.update('bar', 'ascii')

  _hash.update('baz', 'ascii')
  hash.update('baz', 'ascii')

  var a = hash.digest('hex')
  var e = _hash.digest('hex')
  expect(a).to.eq(e)
  return

})


it("hex encoding", () => {
  inputs.forEach(function (v: any) {
    var hash = new Sha1()
    var _hash = crypto.createHash('sha1')

    for (var i = 0; i < v[0].length; i = (i + 1) * 2) {
      var s = v[0].substring(i, (i + 1) * 2)
      hash.update(Buffer.from(s, 'ascii').toString('hex'), 'hex')
      _hash.update(Buffer.from(s, 'ascii').toString('hex'), 'hex')
    }
    var a = hash.digest('hex')
    var e = _hash.digest('hex')

    expect(a).to.eq(e)
  })
})


it("call digest for more than MAX_UINT32 bits of data", () => {
  var _hash = crypto.createHash('sha1')
  var hash = new Sha1()
  var bigData = Buffer.alloc(0x1ffffffff / 8)
  console.log('calculating...')
  hash.update(bigData)
  console.log('calculating again...')
  _hash.update(bigData)
  var a = hash.digest('hex')
  var e = _hash.digest('hex')

  expect(a).to.eq(e)
  return
})