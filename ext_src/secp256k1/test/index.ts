import { expect } from 'chai';
import 'mocha';

import * as fc from 'fast-check';
import * as secp from '..';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import * as sysPath from 'path';
import * as ecdsa from './vectors/ecdsa.json';
import * as ecdh from './vectors/ecdh.json';
import * as privates from './vectors/privates.json';
import * as points from './vectors/points.json';
import * as wp from './vectors/wychenproof.json';


const privatesTxt = readFileSync(sysPath.join(__dirname, 'vectors', 'privates-2.txt'), 'utf-8');
const schCsv = readFileSync(sysPath.join(__dirname, 'vectors', 'schnorr.csv'), 'utf-8');

const FC_BIGINT = fc.bigInt(1n + 1n, secp.CURVE.n - 1n);
// prettier-ignore
const INVALID_ITEMS = ['deadbeef', Math.pow(2, 53), [1], 'xyzxyzxyxyzxyzxyxyzxyzxyxyzxyzxyxyzxyzxyxyzxyzxyxyzxyzxyxyzxyzxy', secp.CURVE.n + 2n];

secp.utils.sha256Sync = (...messages: Uint8Array[]): Uint8Array => {
  const sha256 = createHash('sha256');
  messages.forEach(m => sha256.update(m));
  return sha256.digest();
}

const toBEHex = (n: number | bigint) => n.toString(16).padStart(64, '0');
const hex = secp.utils.bytesToHex;
const hexToBytes = secp.utils.hexToBytes;

function hexToNumber(hex: string): bigint {
  if (typeof hex !== 'string') {
    throw new TypeError('hexToNumber: expected string, got ' + typeof hex);
  }
  // Big Endian
  return BigInt(`0x${hex}`);
}

const expectThrowsAsync = async (method: any) => {
  let error = null
  try {
    await method()
  }
  catch (err) {
    error = err
  }
  expect(error).to.be.an('Error')
}

describe('secp256k1', () => {
  it('.getPublicKey()', () => {
    const data = privatesTxt
      .split('\n')
      .filter((line) => line)
      .map((line) => line.split(':'));
    for (let [priv, x, y] of data) {
      const point = secp.Point.fromPrivateKey(BigInt(priv));
      expect(toBEHex(point.x)).to.eq(x);
      expect(toBEHex(point.y)).to.eq(y);

      const point2 = secp.Point.fromHex(secp.getPublicKey(toBEHex(BigInt(priv))));
      expect(toBEHex(point2.x)).to.eq(x);
      expect(toBEHex(point2.y)).to.eq(y);

      const point3 = secp.Point.fromHex(secp.getPublicKey(hexToBytes(toBEHex(BigInt(priv)))));
      expect(toBEHex(point3.x)).to.eq(x);
      expect(toBEHex(point3.y)).to.eq(y);
    }
  });
  it('.getPublicKey() rejects invalid keys', () => {
    for (const item of INVALID_ITEMS) {
      expect(() => secp.getPublicKey(item as any)).to.throw(Error);
    }
  });
  it('precompute', () => {
    secp.utils.precompute(4);
    const data = privatesTxt
      .split('\n')
      .filter((line) => line)
      .map((line) => line.split(':'));
    for (let [priv, x, y] of data) {
      const point = secp.Point.fromPrivateKey(BigInt(priv));
      expect(toBEHex(point.x)).to.eq(x);
      expect(toBEHex(point.y)).to.eq(y);

      const point2 = secp.Point.fromHex(secp.getPublicKey(toBEHex(BigInt(priv))));
      expect(toBEHex(point2.x)).to.eq(x);
      expect(toBEHex(point2.y)).to.eq(y);

      const point3 = secp.Point.fromHex(secp.getPublicKey(hexToBytes(toBEHex(BigInt(priv)))));
      expect(toBEHex(point3.x)).to.eq(x);
      expect(toBEHex(point3.y)).to.eq(y);
    }
  });
  describe('Point', () => {
    it('.isValidPoint()', () => {
      for (const vector of points.valid.isPoint) {
        const { P, expected } = vector;
        if (expected) {
          secp.Point.fromHex(P);
        } else {
          expect(() => secp.Point.fromHex(P)).to.throw(Error);
        }
      }
    });

    it('.fromPrivateKey()', () => {
      for (const vector of points.valid.pointFromScalar) {
        const { d, expected } = vector;
        let p = secp.Point.fromPrivateKey(d);
        expect(p.toHex(true)).to.eq(expected);
      }
    });

    it('#toHex(compressed)', () => {
      for (const vector of points.valid.pointCompress) {
        const { P, compress, expected } = vector;
        let p = secp.Point.fromHex(P);
        expect(p.toHex(compress)).to.eq(expected);
      }
    });

    it('#toHex() roundtrip', () => {
      fc.assert(
        fc.property(FC_BIGINT, (x) => {
          const point1 = secp.Point.fromPrivateKey(x);
          const hex = point1.toHex(true);
          expect(secp.Point.fromHex(hex).toHex(true)).to.eq(hex);
        })
      );
    });

    it('#add(other)', () => {
      for (const vector of points.valid.pointAdd) {
        const { P, Q, expected } = vector;
        let p = secp.Point.fromHex(P);
        let q = secp.Point.fromHex(Q);
        if (expected) {
          expect(p.add(q).toHex(true)).to.eq(expected);
        } else {
          if (!p.equals(q.negate())) {
            expect(() => p.add(q).toHex(true)).to.throw(Error)
          }
        }
      }
    });

    it('#multiply(privateKey)', () => {
      for (const vector of points.valid.pointMultiply) {
        const { P, d, expected } = vector;
        const p = secp.Point.fromHex(P);
        if (expected) {
          expect(p.multiply(hexToNumber(d)).toHex(true)).to.eq(expected);
        } else {
          expect(() => {
            p.multiply(hexToNumber(d)).toHex(true);
          }).to.throw(Error);
        }
      }

      for (const vector of points.invalid.pointMultiply) {
        const { P, d } = vector;
        if (hexToNumber(d) < secp.CURVE.n) {
          expect(() => {
            const p = secp.Point.fromHex(P);
            p.multiply(hexToNumber(d)).toHex(true);
          }).to.throw(Error);
        }
      }
      for (const num of [0n, 0, -1n, -1, 1.1]) {
        expect(() => secp.Point.BASE.multiply(num)).to.throw(Error);
      }
    });

    // multiply() should equal multiplyUnsafe()
    // it('JacobianPoint#multiplyUnsafe', () => {
    //   const p0 = new secp.JacobianPoint(
    //     55066263022277343669578718895168534326250603453777594175500187360389116729240n,
    //     32670510020758816978083085130507043184471273380659243275938904335757337482424n,
    //     1n
    //   );
    //   const z = 106011723082030650010038151861333186846790370053628296836951575624442507889495n;
    //   console.log(p0.multiply(z));
    //   console.log(secp.JacobianPoint.normalizeZ([p0.multiplyUnsafe(z)])[0])
    // });
  });

  describe('Signature', () => {
    it('.fromCompactHex() roundtrip', () => {
      fc.assert(
        fc.property(FC_BIGINT, FC_BIGINT, (r, s) => {
          const sig = new secp.Signature(r, s);
          expect(secp.Signature.fromCompact(sig.toCompactHex()).toDERHex()).to.eq(sig.toDERHex());
        })
      );
    });

    it('.fromDERHex() roundtrip', () => {
      fc.assert(
        fc.property(FC_BIGINT, FC_BIGINT, (r, s) => {
          const sig = new secp.Signature(r, s);
          expect(secp.Signature.fromDER(sig.toDERHex()).toDERHex()).to.eq(sig.toDERHex());
        })
      );
    });
  });

  describe('.sign()', () => {
    it('should create deterministic signatures with RFC 6979', async () => {
      for (const vector of ecdsa.valid) {
        let usig = await secp.sign(vector.m, vector.d, { der: false });
        let sig = hex(usig);
        const vsig = vector.signature;
        expect(sig.slice(0, 64)).to.eq(vsig.slice(0, 64));
        expect(sig.slice(64, 128)).to.eq(vsig.slice(64, 128));
      }
    });

    it('should not create invalid deterministic signatures with RFC 6979', async () => {
      for (const vector of ecdsa.invalid.sign) {
        await expectThrowsAsync(secp.sign(vector.m, vector.d, { der: false }))
      }
    });

    it('edge cases', async () => {
      // @ts-ignore
      await expectThrowsAsync(secp.sign())
      // @ts-ignore
      await expectThrowsAsync(secp.sign(''))
    });

    it('should create correct DER encoding against libsecp256k1', async () => {
      const CASES = [
        [
          'd1a9dc8ed4e46a6a3e5e594615ca351d7d7ef44df1e4c94c1802f3592183794b',
          '304402203de2559fccb00c148574997f660e4d6f40605acc71267ee38101abf15ff467af02200950abdf40628fd13f547792ba2fc544681a485f2fdafb5c3b909a4df7350e6b',
        ],
        [
          '5f97983254982546d3976d905c6165033976ee449d300d0e382099fa74deaf82',
          '3045022100c046d9ff0bd2845b9aa9dff9f997ecebb31e52349f80fe5a5a869747d31dcb88022011f72be2a6d48fe716b825e4117747b397783df26914a58139c3f4c5cbb0e66c',
        ],
        [
          '0d7017a96b97cd9be21cf28aada639827b2814a654a478c81945857196187808',
          '3045022100d18990bba7832bb283e3ecf8700b67beb39acc73f4200ed1c331247c46edccc602202e5c8bbfe47ae159512c583b30a3fa86575cddc62527a03de7756517ae4c6c73',
        ],
      ];
      const privKey = hexToBytes(
        '0101010101010101010101010101010101010101010101010101010101010101'
      );
      for (let [msg, exp] of CASES) {
        const res = await secp.sign(msg, privKey, { extraEntropy: undefined });
        expect(hex(res)).to.eq(exp);
        const rs = secp.Signature.fromDER(res).toCompactHex();
        expect(secp.Signature.fromCompact(rs).toDERHex()).to.eq(exp);
      }
    });
    it('sign ecdsa extraData', async () => {
      const ent1 = '0000000000000000000000000000000000000000000000000000000000000000';
      const ent2 = '0000000000000000000000000000000000000000000000000000000000000001';
      const ent3 = '6e723d3fd94ed5d2b6bdd4f123364b0f3ca52af829988a63f8afe91d29db1c33';
      const ent4 = 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141';
      const ent5 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

      for (const e of ecdsa.extraEntropy) {
        const sign = async (extraEntropy?: string) => {
          const s = await secp.sign(e.m, e.d, { der: false, extraEntropy });
          return hex(s);
        };
        expect(await sign()).to.eq(e.signature);
        expect(await sign(ent1)).to.eq(e.extraEntropy0);
        expect(await sign(ent2)).to.eq(e.extraEntropy1);
        expect(await sign(ent3)).to.eq(e.extraEntropyRand);
        expect(await sign(ent4)).to.eq(e.extraEntropyN);
        expect(await sign(ent5)).to.eq(e.extraEntropyMax);
      }
    });
  });

  describe('.verify()', () => {
    it('should verify signature', async () => {
      const MSG = '01'.repeat(32);
      const PRIV_KEY = 0x2n;
      const signature = await secp.sign(MSG, PRIV_KEY);
      const publicKey = secp.getPublicKey(PRIV_KEY);
      expect(publicKey.length).to.eq(65);
      expect(secp.verify(signature, MSG, publicKey)).to.eq(true);
    });
    it('should not verify signature with wrong public key', async () => {
      const MSG = '01'.repeat(32);
      const PRIV_KEY = 0x2n;
      const WRONG_PRIV_KEY = 0x22n;
      const signature = await secp.sign(MSG, PRIV_KEY);
      const publicKey = secp.Point.fromPrivateKey(WRONG_PRIV_KEY).toHex();
      expect(publicKey.length).to.eq(130);
      expect(secp.verify(signature, MSG, publicKey)).to.eq(false);
    });
    it('should not verify signature with wrong hash', async () => {
      const MSG = '01'.repeat(32);
      const PRIV_KEY = 0x2n;
      const WRONG_MSG = '11'.repeat(32);
      const signature = await secp.sign(MSG, PRIV_KEY);
      const publicKey = secp.getPublicKey(PRIV_KEY);
      expect(publicKey.length).to.eq(65);
      expect(secp.verify(signature, WRONG_MSG, publicKey)).to.eq(false);
    });
    it('should verify random signatures', async () =>
      fc.assert(
        fc.asyncProperty(FC_BIGINT, fc.hexaString({minLength: 64, maxLength: 64}), async (privKey, msg) => {
          const pub = secp.getPublicKey(privKey);
          const sig = await secp.sign(msg, privKey);
          expect(secp.verify(sig, msg, pub)).to.eq(true);
        })
      ));
    it('should not verify signature with invalid r/s', () => {
      const msg = new Uint8Array([
        0xbb, 0x5a, 0x52, 0xf4, 0x2f, 0x9c, 0x92, 0x61, 0xed, 0x43, 0x61, 0xf5, 0x94, 0x22, 0xa1,
        0xe3, 0x00, 0x36, 0xe7, 0xc3, 0x2b, 0x27, 0x0c, 0x88, 0x07, 0xa4, 0x19, 0xfe, 0xca, 0x60,
        0x50, 0x23,
      ]);
      const x = 100260381870027870612475458630405506840396644859280795015145920502443964769584n;
      const y = 41096923727651821103518389640356553930186852801619204169823347832429067794568n;
      const r = 1n;
      const s = 115792089237316195423570985008687907852837564279074904382605163141518162728904n;

      const pub = new secp.Point(x, y);
      const signature = new secp.Signature(2n, 2n);
      // @ts-ignore
      signature.r = r;
      // @ts-ignore
      signature.s = s;

      const verified = secp.verify(signature, msg, pub);
      // Verifies, but it shouldn't, because signature S > curve order
      expect(verified).to.eq(false);
    });
    it('should not verify msg = curve order', async () => {
      const msg = 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141';
      const x = 55066263022277343669578718895168534326250603453777594175500187360389116729240n;
      const y = 32670510020758816978083085130507043184471273380659243275938904335757337482424n;
      const r = 104546003225722045112039007203142344920046999340768276760147352389092131869133n;
      const s = 96900796730960181123786672629079577025401317267213807243199432755332205217369n;
      const pub = new secp.Point(x, y);
      const sig = new secp.Signature(r, s);
      expect(secp.verify(sig, msg, pub)).to.eq(false);
    });
    it('should verify non-strict msg bb5a...', async () => {
      const msg = 'bb5a52f42f9c9261ed4361f59422a1e30036e7c32b270c8807a419feca605023';
      const x = 3252872872578928810725465493269682203671229454553002637820453004368632726370n;
      const y = 17482644437196207387910659778872952193236850502325156318830589868678978890912n;
      const r = 432420386565659656852420866390673177323n;
      const s = 115792089237316195423570985008687907852837564279074904382605163141518161494334n;
      const pub = new secp.Point(x, y);
      const sig = new secp.Signature(r, s);
      expect(secp.verify(sig, msg, pub, { strict: false })).to.eq(true);
    });
    it('should not verify invalid deterministic signatures with RFC 6979', () => {
      for (const vector of ecdsa.invalid.verify) {
        const res = secp.verify(vector.signature, vector.m, vector.Q);
        expect(res).to.eq(false);
      }
    });
  });

  describe('schnorr', () => {
    // index,secret key,public key,aux_rand,message,signature,verification result,comment
    const vectors = schCsv
      .split('\n')
      .map((line: string) => line.split(','))
      .slice(1, -1);
    for (let vec of vectors) {
      const [index, sec, pub, rnd, msg, expSig, passes, comment] = vec;
      it(`should sign with Schnorr scheme vector ${index}`, async () => {
        if (sec) {
          expect(hex(secp.schnorr.getPublicKey(sec))).to.eq(pub.toLowerCase());
          const sig = await secp.schnorr.sign(msg, sec, rnd);
          const sigS = secp.schnorr.signSync(msg, sec, rnd);
          expect(hex(sig)).to.eq(expSig.toLowerCase());
          expect(hex(sigS)).to.eq(expSig.toLowerCase());
          expect(await secp.schnorr.verify(sigS, msg, pub)).to.eq(true);
          expect(secp.schnorr.verifySync(sig, msg, pub)).to.eq(true);
        } else {
          const passed = await secp.schnorr.verify(expSig, msg, pub);
          const passedS = secp.schnorr.verifySync(expSig, msg, pub);
          if (passes === 'TRUE') {
            expect(passed).to.eq(true);
            expect(passedS).to.eq(true);
          } else {
            expect(passed).to.eq(false);
            expect(passedS).to.eq(false);
          }
        }
      });
    }
  });

  describe('.recoverPublicKey()', () => {
    it('should recover public key from recovery bit', async () => {
      const message = '00000000000000000000000000000000000000000000000000000000deadbeef';
      const privateKey = 123456789n;
      const publicKey = secp.Point.fromHex(secp.getPublicKey(privateKey)).toHex(false);
      const [signature, recovery] = await secp.sign(message, privateKey, { recovered: true });
      const recoveredPubkey = secp.recoverPublicKey(message, signature, recovery);
      expect(recoveredPubkey).not.to.eq(null);
      expect(hex(recoveredPubkey!)).to.eq(publicKey);
      expect(secp.verify(signature, message, publicKey)).to.eq(true);
    });
    it('should not recover zero points', () => {
      const msgHash = '6b8d2c81b11b2d699528dde488dbdf2f94293d0d33c32e347f255fa4a6c1f0a9';
      const sig =
        '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f817986b8d2c81b11b2d699528dde488dbdf2f94293d0d33c32e347f255fa4a6c1f0a9';
      const recovery = 0;
      expect(() => secp.recoverPublicKey(msgHash, sig, recovery)).to.throw(Error);
    });
    it('should handle all-zeros msghash', async () => {
      const privKey = secp.utils.randomPrivateKey();
      const pub = secp.getPublicKey(privKey);
      const zeros = '0000000000000000000000000000000000000000000000000000000000000000';
      const [sig, rec] = await secp.sign(zeros, privKey, { recovered: true });
      const recoveredKey = secp.recoverPublicKey(zeros, sig, rec);
      expect(recoveredKey.toLocaleString()).to.eq(pub.toLocaleString());
    });
    it('should handle RFC 6979 vectors', async () => {
      for (const vector of ecdsa.valid) {
        if (secp.utils.mod(hexToNumber(vector.m), secp.CURVE.n) === 0n) continue;
        let [usig, rec] = await secp.sign(vector.m, vector.d, { der: false, recovered: true });
        let sig = hex(usig);
        const vpub = secp.getPublicKey(vector.d);
        const recovered = secp.recoverPublicKey(vector.m, sig, rec)!;
        expect(hex(recovered)).to.eq(hex(vpub));
      }
    });
  });

  describe('.getSharedSecret()', () => {
    // TODO: Real implementation.
    function derToPub(der: string) {
      return der.slice(46);
    }
    it('should produce correct results', () => {
      // TODO: Once der is there, run all tests.
      for (const vector of ecdh.testGroups[0].tests.slice(0, 230)) {
        if (vector.result === 'invalid' || vector.private.length !== 64) {
          expect(() => {
            secp.getSharedSecret(vector.private, derToPub(vector.public), true);
          }).to.throw(Error);
        } else if (vector.result === 'valid') {
          const res = secp.getSharedSecret(vector.private, derToPub(vector.public), true);
          expect(hex(res.slice(1))).to.eq(`${vector.shared}`);
        }
      }
    });
    it('priv/pub order matters', () => {
      for (const vector of ecdh.testGroups[0].tests.slice(0, 100)) {
        if (vector.result === 'valid') {
          let priv = vector.private;
          priv = priv.length === 66 ? priv.slice(2) : priv;
          expect(() => secp.getSharedSecret(derToPub(vector.public), priv, true)).to.throw(Error);
        }
      }
    });
    it('rejects invalid keys', () => {
      expect(() => secp.getSharedSecret('01', '02')).to.throw(Error);
    });
  });

  describe('utils', () => {
    it('isValidPrivateKey()', () => {
      for (const vector of (privates as any).valid.isPrivate) {
        const { d, expected } = vector;
        expect(secp.utils.isValidPrivateKey(d)).to.eq(expected);
      }
    });
    it('privateAdd()', () => {
      for (const vector of (privates as any).valid.add) {
        const { a, b, expected } = vector;
        expect(secp.utils.bytesToHex(secp.utils.privateAdd(a, b))).to.eq(expected);
      }
    });
    it('privateNegate()', () => {
      for (const vector of (privates as any).valid.negate) {
        const { a, expected } = vector;
        expect(secp.utils.bytesToHex(secp.utils.privateNegate(a))).to.eq(expected);
      }
    });
    it('pointAddScalar()', () => {
      for (const vector of points.valid.pointAddScalar) {
        const { description, P, d, expected } = vector;
        const compressed = !!expected && expected.length === 66; // compressed === 33 bytes
        expect(secp.utils.bytesToHex(secp.utils.pointAddScalar(P, d, compressed))).to.eq(expected);
      }
    });
    it('pointAddScalar() invalid', () => {
      for (const vector of points.invalid.pointAddScalar) {
        const { P, d, exception } = vector;
        expect(() => secp.utils.pointAddScalar(P, d)).to.Throw(RegExp(`${exception}`));
      }
    });
    it('pointMultiply()', () => {
      for (const vector of points.valid.pointMultiply) {
        const { P, d, expected } = vector;
        expect(secp.utils.bytesToHex(secp.utils.pointMultiply(P, d, true))).to.eq(expected);
      }
    });
    it('pointMultiply() invalid', () => {
      for (const vector of points.invalid.pointMultiply) {
        const { P, d, exception } = vector;
        expect(() => secp.utils.pointMultiply(P, d)).to.Throw(RegExp(`${exception}`));
      }
    });
  });

  describe('wychenproof vectors', () => {
    it('should pass all tests', async () => {
      for (let group of wp.testGroups) {
        const pubKey = secp.Point.fromHex(group.key.uncompressed);
        for (let test of group.tests) {
          const m = await secp.utils.sha256(hexToBytes(test.msg));
          if (test.result === 'valid' || test.result === 'acceptable') {
            const verified = secp.verify(test.sig, m, pubKey);
            if (secp.Signature.fromDER(test.sig).hasHighS()) {
              expect(verified).to.eq(false);
            } else {
              expect(verified).to.eq(true);
            }
          } else if (test.result === 'invalid') {
            let failed = false;
            try {
              const verified = secp.verify(test.sig, m, pubKey);
              if (!verified) failed = true;
            } catch (error) {
              failed = true;
            }
            expect(failed).to.eq(true);
          } else {
            expect(false).to.eq(true);
          }
        }
      }
    });
  });
});
