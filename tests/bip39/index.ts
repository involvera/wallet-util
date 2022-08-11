import 'mocha';
import { expect } from 'chai';
import { Buffer } from '../../ext_src/buffer'
import * as bip39 from '../../ext_src/bip39'

var WORDLISTS = {
  english: require('../../ext_src/bip39/english.json'),
}

var vectors = require('./vectors.json')
var test = require('tape')

function testVector (description: any, wordlist: any, password: any, v: any, i: any) {
  var ventropy = v[0]
  var vmnemonic = v[1]
  var vseedHex = v[2]

  it('for ' + description + '(' + i + '), ' + ventropy, () => {
    expect(bip39.mnemonicToEntropy(vmnemonic, wordlist)).to.eq(ventropy) //, 'mnemonicToEntropy returns ' + ventropy.slice(0, 40) + '...')
    expect(bip39.mnemonicToSeedSync(vmnemonic, password).toString('hex')).to.eq(vseedHex)//, 'mnemonicToSeedSync returns ' + vseedHex.slice(0, 40) + '...')
    expect(bip39.entropyToMnemonic(ventropy, wordlist)).to.eq(vmnemonic)//, 'entropyToMnemonic returns ' + vmnemonic.slice(0, 40) + '...')

    const rng = () => Buffer.from(ventropy, 'hex') 
    expect(bip39.generateMnemonic(undefined, rng, wordlist)).to.eq(vmnemonic)//, 'generateMnemonic returns RNG entropy unmodified')
    expect(bip39.validateMnemonic(vmnemonic, wordlist)).to.eq(true) // 'validateMnemonic returns true')
  })
}

describe('bip39', () => {
  vectors.english.forEach(function (v: any, i: any) { testVector('English', undefined, 'TREZOR', v, i) })

  it('invalid entropy', () => {
  
    expect(function () {
      bip39.entropyToMnemonic(Buffer.from('', 'hex'))
    }).to.throw(/^Invalid entropy$/)

    expect(function () {
      bip39.entropyToMnemonic(Buffer.from('000000', 'hex'))
    }).to.throw(/^Invalid entropy$/)

    expect(function () {
      bip39.entropyToMnemonic(Buffer.from(new Array(1028 + 1).join('00'), 'hex'))
    }).to.throw(/^Invalid entropy$/)
  })
})

it('generateMnemonic can vary entropy length', () => {
  var words = bip39.generateMnemonic(160).split(' ')
  expect(words.length).to.eq(15)
})

it('generateMnemonic requests the exact amount of data from an RNG', () => {
  bip39.generateMnemonic(160, function (size) {
    expect(size).to.eq(160 / 8)
    return Buffer.allocUnsafe(size)
  })
})

it('validateMnemonic', () => {
  expect(bip39.validateMnemonic('sleep kitten')).to.eq(false)
  expect(bip39.validateMnemonic('sleep kitten sleep kitten sleep kitten')).to.eq(false)
  expect(bip39.validateMnemonic('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about end grace oxygen maze bright face loan ticket trial leg cruel lizard bread worry reject journey perfect chef section caught neither install industry')).to.eq(false)
  expect(bip39.validateMnemonic('turtle front uncle idea crush write shrug there lottery flower risky shell')).to.eq(false)
  expect(bip39.validateMnemonic('sleep kitten sleep kitten sleep kitten sleep kitten sleep kitten sleep kitten')).to.eq(false)
})

it('exposes standard wordlists', () => {
  expect(bip39.wordlists.EN).to.eq(WORDLISTS.english)
  expect(bip39.wordlists.EN.length).to.eq(2048)
})
