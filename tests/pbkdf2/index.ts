
import { expect } from 'chai';
import 'mocha';
var fixtures = require('./fixtures.json')
import { Buffer } from '../../src/buffer'
import pbkdf2Sync from '../../src/pbkdf2'

fixtures.invalid.push({
    key: 'password',
    salt: 'salt',
    iterations: 1,
    dkLen: -1,
    exception: 'Bad key length'
  }, {
    key: 'password',
    salt: 'salt',
    iterations: 1,
    dkLen: 4073741824,
    exception: 'Bad key length'
})

fixtures.invalid.push({
    key: 'password',
    salt: 'salt',
    iterations: 1,
    dkLen: NaN,
    exception: 'Bad key length'
  }, {
    key: 'password',
    salt: 'salt',
    iterations: 1,
    dkLen: Infinity,
    exception: 'Bad key length'
  })

 fixtures.valid.push({
    description: 'Unicode salt, no truncation',
    key: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    salt: 'mnemonicメートルガバヴァぱばぐゞちぢ十人十色',
    iterations: 2048,
    dkLen: 64,
    results: {
      sha1: '7e042a2f41ba17e2235fbc794e22a150816b0f54a1dfe113919fccb7a056066a109385e538f183c92bad896ae8b7d8e0f4cd66df359c77c8c7785cd1001c9a2c',
      sha256: '0b57118f2b6b079d9371c94da3a8315c3ada87a1e819b40c4c4e90b36ff2d3c8fd7555538b5119ac4d3da7844aa4259d92f9dd2188e78ac33c4b08d8e6b5964b',
      sha512: 'ba553eedefe76e67e2602dc20184c564010859faada929a090dd2c57aacb204ceefd15404ab50ef3e8dbeae5195aeae64b0def4d2eead1cdc728a33ced520ffd',
      sha224: 'd76474c525616ce2a527d23df8d6f6fcc4251cc3535cae4e955810a51ead1ec6acbe9c9619187ca5a3c4fd636de5b5fe58d031714731290bbc081dbf0fcb8fc1',
      sha384: '15010450f456769467e834db7fa93dd9d353e8bb733b63b0621090f96599ac3316908eb64ac9366094f0787cd4bfb2fea25be41dc271a19309710db6144f9b34',
      ripemd160: '255321c22a32f41ed925032043e01afe9cacf05470c6506621782c9d768df03c74cb3fe14a4296feba4c2825e736486fb3871e948f9c413ca006cc20b7ff6d37'
    }
  })

  const runTests = () => {
    it('defaults to sha1 and handles buffers', () => {
      var resultSync = pbkdf2Sync(Buffer.from('password'), Buffer.from('salt'), 1, 32, '')
      expect(resultSync.toString('hex')).to.eq('0c60c80f961f0e71f3a9b524af6012062fe037a6e0f0eb94fe8fc46bdc637164')
    })
  

    var algos = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'ripemd160']
    algos.forEach(function (algorithm) {
      fixtures.valid.forEach(function (f: any) {
        var key: any
        var keyType: any 
        var salt: any 
        var saltType: any

        if (f.keyUint8Array) {
          key = new Uint8Array(f.keyUint8Array)
          keyType = 'Uint8Array'
        } else if (f.keyInt32Array) {
          key = new Int32Array(f.keyInt32Array)
          keyType = 'Int32Array'
        } else if (f.keyFloat64Array) {
          key = new Float64Array(f.keyFloat64Array)
          keyType = 'Float64Array'
        } else if (f.keyHex) {
          key = Buffer.from(f.keyHex, 'hex')
          keyType = 'hex'
        } else {
          key = f.key
          keyType = 'string'
        }
        if (f.saltUint8Array) {
          salt = new Uint8Array(f.saltUint8Array)
          saltType = 'Uint8Array'
        } else if (f.saltInt32Array) {
          salt = new Int32Array(f.saltInt32Array)
          saltType = 'Int32Array'
        } else if (f.saltFloat64Array) {
          salt = new Float64Array(f.saltFloat64Array)
          saltType = 'Float64Array'
        } else if (f.saltHex) {
          salt = Buffer.from(f.saltHex, 'hex')
          saltType = 'hex'
        } else {
          salt = f.salt
          saltType = 'string'
        }
        var expected = f.results[algorithm]
        var description = algorithm + ' encodes "' + key + '" (' + keyType + ') with salt "' + salt + '" (' + saltType + ') with ' + algorithm + ' to ' + expected
  
        it('sync w/ ' + description, () => {
          var result = pbkdf2Sync(key, salt, f.iterations, f.dkLen, algorithm)
          expect(result.toString('hex')).to.eq(expected)
        })
      })
  
      fixtures.invalid.forEach(function (f: any) {
        var description = algorithm + ' should throw ' + f.exception
        it(' sync w/' + description, () => {
  
          expect(function () {
            pbkdf2Sync(f.key, f.salt, f.iterations, f.dkLen, f.algo)
          }).to.throw(new RegExp(f.exception))
        })
      })
    })
  }

  runTests()