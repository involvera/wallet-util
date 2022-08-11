import 'mocha';
import { expect } from 'chai';

import { BIP32Factory } from '../../src/bip32'
import { Buffer}  from '../../src/buffer'

let fixtures = require('./data.json')

const ecc = require('tiny-secp256k1')
const BIP32 = BIP32Factory(ecc)
    
let LITECOIN = {
  wif: 0xb0,
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe
  }
}

const main = () => {
  describe('Bip32', () => {


  // TODO: amend the JSON
  let validAll: any = []
  fixtures.valid.forEach((f: any) => {
    f.master.network = f.network
    f.master.children = f.children
    f.master.comment = f.comment
    f.children.forEach((fc: any) => {
      fc.network = f.network
      validAll.push(fc)
    })
    delete f.children
    validAll.push(f.master)
  })

  function verify (hd: any, prv: any, f: any, network: any) {
    expect(hd.chainCode.toString('hex')).to.eq(f.chainCode)
    expect(hd.depth).to.eq( f.depth >>> 0)
    expect(hd.index).to.eq( f.index >>> 0)
    expect(hd.compressed).to.eq( true)
    expect(hd.fingerprint.toString('hex')).to.eq( f.fingerprint)
    expect(hd.identifier.toString('hex')).to.eq( f.identifier)
    expect(hd.publicKey.toString('hex')).to.eq( f.pubKey)
    if (prv) expect(hd.toBase58()).to.eq( f.base58Priv)
    if (prv) expect(hd.privateKey.toString('hex')).to.eq( f.privKey)
    if (!prv) expect(hd.privateKey).to.eq( undefined)
    expect(hd.neutered().toBase58()).to.eq( f.base58)
    expect(hd.isNeutered()).to.eq(!prv)

    if (!f.children) return
    if (!prv && f.children.some((x: any) => x.hardened)) return

    // test deriving path from master
    f.children.forEach((cf: any, index: number) => {
      let chd = hd.derivePath(cf.path)
      verify(chd, prv, cf, network)

      let chdNoM = hd.derivePath(cf.path.slice(2)) // no m/
      verify(chdNoM, prv, cf, network)
    })

    // test deriving path from successive children
    let shd = hd
    f.children.forEach((cf: any, index: number) => {
      if (cf.m === undefined) return
      if (cf.hardened) {
        shd = shd.deriveHardened(cf.m)
      } else {
        // verify any publicly derived children
        if (cf.base58) verify(shd.neutered().derive(cf.m), false, cf, network)

        shd = shd.derive(cf.m)
        verify(shd, prv, cf, network)
      }

      expect(() => {
        shd.derivePath('m/0')
      }).to.throw(/Expected master, got child/)

      verify(shd, prv, cf, network)
    })
  }

  validAll.forEach((ff: any, index: number) => {
    it(ff.comment || ff.base58Priv, () => {
      let network
      if (ff.network === 'litecoin') network = LITECOIN
    
      let hd = BIP32.fromBase58(ff.base58Priv, network)
      verify(hd, true, ff, network)

      hd = BIP32.fromBase58(ff.base58, network)
      verify(hd, false, ff, network)

      if (ff.seed) {
        let seed = Buffer.from(ff.seed, 'hex')
        hd = BIP32.fromSeed(seed, network)
        verify(hd, true, ff, network)
      }
    })
  })

  it('invalid ecc library throws', () => {
    expect(() => {
      BIP32Factory({ isPoint: () => false } as any)
    }).to.throw(/ecc library invalid/)
    // Run with no schnorr and check it doesn't throw
    BIP32Factory({ ...ecc, signSchnorr: null, verifySchnorr: null })
  })

  it('fromBase58 throws', () => {
    fixtures.invalid.fromBase58.forEach((f:any) => {
      expect(() => {
        let network
        if (f.network === 'litecoin') network = LITECOIN

        BIP32.fromBase58(f.string, network)
      }).to.throw(new RegExp(f.exception))
    })
  })

  it('works for Private -> public (neutered)', () => {
    let f = fixtures.valid[1]
    let c = f.master.children[0]

    let master = BIP32.fromBase58(f.master.base58Priv)
    let child = master.derive(c.m).neutered()


    expect(child.toBase58()).to.eq(c.base58)
  })

  it('works for Private -> public (neutered, hardened)', () => {
    let f = fixtures.valid[0]
    let c = f.master.children[0]

    let master = BIP32.fromBase58(f.master.base58Priv)
    let child = master.deriveHardened(c.m).neutered()

    expect(c.base58).to.eq(child.toBase58())
  })

  it('works for Public -> public', () => {
    let f = fixtures.valid[1]
    let c = f.master.children[0]

    let master = BIP32.fromBase58(f.master.base58)
    let child = master.derive(c.m)

    expect(c.base58).to.eq(child.toBase58())
  })

  it('throws on Public -> public (hardened)', () => {
    let f = fixtures.valid[0]
    let c = f.master.children[0]

    let master = BIP32.fromBase58(f.master.base58)

    expect(() => {
      master.deriveHardened(c.m)
    }).to.throw(/Missing private key for hardened child key/)
  })

  it('throws on wrong types', () => {
    let f = fixtures.valid[0]
    let master = BIP32.fromBase58(f.master.base58)

    fixtures.invalid.derive.forEach((fx: any) => {
      expect(() => {
        master.derive(fx)
      }).to.throw(/Expected UInt32/)
    })

    fixtures.invalid.deriveHardened.forEach((fx: any) => {
      expect(() => {
        master.deriveHardened(fx)
      }).to.throw(/Expected UInt31/)
    })

    fixtures.invalid.derivePath.forEach((fx: any) => {
      expect(() => {
        master.derivePath(fx)
      }).to.throw(/Expected BIP32Path, got/)
    })

    let ZERO = Buffer.alloc(32, 0)
    let ONES = Buffer.alloc(32, 1)

    expect(() => {
      BIP32.fromPrivateKey(Buffer.alloc(2), ONES)
    }).to.throw(/Expected property "privateKey" of type Buffer\(Length: 32\), got Buffer\(Length: 2\)/)

    expect(() => {
      BIP32.fromPrivateKey(ZERO, ONES)
    }).to.throw(/Private key not in range \[1, n\)/)
  })

  it('works when private key has leading zeros', () => {
    let key = 'xprv9s21ZrQH143K3ckY9DgU79uMTJkQRLdbCCVDh81SnxTgPzLLGax6uHeBULTtaEtcAvKjXfT7ZWtHzKjTpujMkUd9dDb8msDeAfnJxrgAYhr'
    let hdkey = BIP32.fromBase58(key)
    expect(hdkey.privateKey?.toString('hex'), '00000055378cf5fafb56c711c674143f9b0ee82ab0ba2924f19b64f5ae7cdbfd')
    let child = hdkey.derivePath('m/44\'/0\'/0\'/0/0\'')
    expect(child.privateKey?.toString('hex'), '3348069561d2a0fb925e74bf198762acc47dce7db27372257d2d959a9e6f8aeb')
  })

  it('fromSeed', () => {
    // TODO
  //    'throws if IL is not within interval [1, n - 1] | IL === n || IL === 0'
    fixtures.invalid.fromSeed.forEach((f: any) => {
      expect(() => {
        BIP32.fromSeed(Buffer.from(f.seed, 'hex'))
      }).to.throw(new RegExp(f.exception))
    })
  })

  it('ecdsa', () => {
    let seed = Buffer.alloc(32, 1)
    let hash = Buffer.alloc(32, 2)
    let signature = Buffer.from('9636ee2fac31b795a308856b821ebe297dda7b28220fb46ea1fbbd7285977cc04c82b734956246a0f15a9698f03f546d8d96fe006c8e7bd2256ca7c8229e6f5c', 'hex')
    let schnorrsig = Buffer.from('2fae8b517cb0e7302ca48a4109d1819e3d75af96bd58d297023e3058c4e98ff812fe6ae32a2b2bc4abab10f88f7fe56efbafc8a4e4fa437af78926f528b0585e', 'hex')
    let signatureLowR = Buffer.from('0587a40b391b76596c257bf59565b24eaff2cc42b45caa2640902e73fb97a6e702c3402ab89348a7dae1bf171c3e172fa60353d7b01621a94cb7caca59b995db', 'hex')
    let node = BIP32.fromSeed(seed)

    expect(node.sign(hash).toString('hex')).to.eq(signature.toString('hex'))
    expect(node.sign(hash, true).toString('hex')).to.eq( signatureLowR.toString('hex'))
    expect(node.signSchnorr(hash).toString('hex')).to.eq( schnorrsig.toString('hex'))
    expect(node.verify(hash, signature)).to.eq( true)
    expect(node.verify(seed, signature)).to.eq( false)
    expect(node.verify(hash, signatureLowR)).to.eq( true)
    expect(node.verify(seed, signatureLowR)).to.eq( false)
    expect(node.verifySchnorr(hash, schnorrsig)).to.eq(true)
    expect(node.verifySchnorr(seed, schnorrsig)).to.eq( false)
  })
})

}


main()