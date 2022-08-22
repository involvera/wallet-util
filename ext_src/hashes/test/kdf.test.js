const assert = require('assert');
const crypto = require('crypto');
const { should } = require('micro-should');
const { sha256 } = require('../src/sha256');
const { sha512 } = require('../src/sha512');
const { extract: hkdf_extract, hkdf } = require('../src/hkdf');
const { pbkdf2, pbkdf2Async } = require('../src/pbkdf2');
const { scrypt, scryptAsync } = require('../src/scrypt');
const { utf8ToBytes, hexToBytes, TYPE_TEST, SPACE, EMPTY } = require('./utils');
const { executeKDFTests } = require('./generator');
// HKDF test vectors from RFC 5869
const HKDF_VECTORS = [
  {
    hash: sha256,
    IKM: hexToBytes('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b'),
    salt: hexToBytes('000102030405060708090a0b0c'),
    info: hexToBytes('f0f1f2f3f4f5f6f7f8f9'),
    L: 42,
    PRK: hexToBytes('077709362c2e32df0ddc3f0dc47bba6390b6c73bb50f9c3122ec844ad7c2b3e5'),
    OKM: hexToBytes(
      '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865'
    ),
  },
  {
    hash: sha256,
    IKM: hexToBytes(
      '000102030405060708090a0b0c0d0e0f' +
        '101112131415161718191a1b1c1d1e1f' +
        '202122232425262728292a2b2c2d2e2f' +
        '303132333435363738393a3b3c3d3e3f' +
        '404142434445464748494a4b4c4d4e4f'
    ),
    salt: hexToBytes(
      '606162636465666768696a6b6c6d6e6f' +
        '707172737475767778797a7b7c7d7e7f' +
        '808182838485868788898a8b8c8d8e8f' +
        '909192939495969798999a9b9c9d9e9f' +
        'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf'
    ),
    info: hexToBytes(
      'b0b1b2b3b4b5b6b7b8b9babbbcbdbebf' +
        'c0c1c2c3c4c5c6c7c8c9cacbcccdcecf' +
        'd0d1d2d3d4d5d6d7d8d9dadbdcdddedf' +
        'e0e1e2e3e4e5e6e7e8e9eaebecedeeef' +
        'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff'
    ),
    L: 82,
    PRK: hexToBytes('06a6b88c5853361a06104c9ceb35b45cef760014904671014a193f40c15fc244'),
    OKM: hexToBytes(
      'b11e398dc80327a1c8e7f78c596a4934' +
        '4f012eda2d4efad8a050cc4c19afa97c' +
        '59045a99cac7827271cb41c65e590e09' +
        'da3275600c2f09b8367793a9aca3db71' +
        'cc30c58179ec3e87c14c01d5c1f3434f' +
        '1d87'
    ),
  },
  {
    hash: sha256,
    IKM: hexToBytes('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b'),
    salt: hexToBytes(''),
    info: hexToBytes(''),
    L: 42,
    PRK: hexToBytes('19ef24a32c717b167f33a91d6f648bdf96596776afdb6377ac434c1c293ccb04'),
    OKM: hexToBytes(
      '8da4e775a563c18f715f802a063c5a31' +
        'b8a11f5c5ee1879ec3454e5f3c738d2d' +
        '9d201395faa4b61a96c8'
    ),
  },
  {
    hash: sha256,
    IKM: hexToBytes('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b'),
    salt: undefined,
    info: undefined,
    L: 42,
    PRK: hexToBytes('19ef24a32c717b167f33a91d6f648bdf96596776afdb6377ac434c1c293ccb04'),
    OKM: hexToBytes(
      '8da4e775a563c18f715f802a063c5a31' +
        'b8a11f5c5ee1879ec3454e5f3c738d2d' +
        '9d201395faa4b61a96c8'
    ),
  },
];

// Scrypt test vectors from RFC 7914
const SCRYPT_VECTORS = [
  {
    P: utf8ToBytes(''),
    S: utf8ToBytes(''),
    N: 16,
    r: 1,
    p: 1,
    dkLen: 64,
    exp:
      '77 d6 57 62 38 65 7b 20 3b 19 ca 42 c1 8a 04 97' +
      'f1 6b 48 44 e3 07 4a e8 df df fa 3f ed e2 14 42' +
      'fc d0 06 9d ed 09 48 f8 32 6a 75 3a 0f c8 1f 17' +
      'e8 d3 e0 fb 2e 0d 36 28 cf 35 e2 0c 38 d1 89 06',
  },
  {
    P: utf8ToBytes('password'),
    S: utf8ToBytes('NaCl'),
    N: 1024,
    r: 8,
    p: 16,
    dkLen: 64,
    exp:
      'fd ba be 1c 9d 34 72 00 78 56 e7 19 0d 01 e9 fe' +
      '7c 6a d7 cb c8 23 78 30 e7 73 76 63 4b 37 31 62' +
      '2e af 30 d9 2e 22 a3 88 6f f1 09 27 9d 98 30 da' +
      'c7 27 af b9 4a 83 ee 6d 83 60 cb df a2 cc 06 40',
  },
  {
    P: utf8ToBytes('pleaseletmein'),
    S: utf8ToBytes('SodiumChloride'),
    N: 16384,
    r: 8,
    p: 1,
    dkLen: 64,
    exp:
      '70 23 bd cb 3a fd 73 48 46 1c 06 cd 81 fd 38 eb' +
      'fd a8 fb ba 90 4f 8e 3e a9 b5 43 f6 54 5d a1 f2' +
      'd5 43 29 55 61 3f 0f cf 62 d4 97 05 24 2a 9a f9' +
      'e6 1e 85 dc 0d 65 1e 40 df cf 01 7b 45 57 58 87',
  },
  {
    P: utf8ToBytes('pleaseletmein'),
    S: utf8ToBytes('SodiumChloride'),
    N: 1048576,
    r: 8,
    p: 1,
    dkLen: 64,
    maxmem: 1024 ** 4,
    exp:
      '21 01 cb 9b 6a 51 1a ae ad db be 09 cf 70 f8 81' +
      'ec 56 8d 57 4a 2f fd 4d ab e5 ee 98 20 ad aa 47' +
      '8e 56 fd 8f 4b a5 d0 9f fa 1c 6d 92 7c 40 f4 c3' +
      '37 30 40 49 e8 a9 52 fb cb f4 5c 6f a7 7a 41 a4',
  },
];

const PBKDF2_VECTORS = [
  // Vectors from RFC 7914 (scrypt)
  {
    hash: sha256,
    P: utf8ToBytes('passwd'),
    S: utf8ToBytes('salt'),
    c: 1,
    dkLen: 64,
    exp:
      '55 ac 04 6e 56 e3 08 9f ec 16 91 c2 25 44 b6 05' +
      'f9 41 85 21 6d de 04 65 e6 8b 9d 57 c2 0d ac bc' +
      '49 ca 9c cc f1 79 b6 45 99 16 64 b3 9d 77 ef 31' +
      '7c 71 b8 45 b1 e3 0b d5 09 11 20 41 d3 a1 97 83',
  },
  {
    hash: sha256,
    P: utf8ToBytes('Password'),
    S: utf8ToBytes('NaCl'),
    c: 80000,
    dkLen: 64,
    exp:
      '4d dc d8 f6 0b 98 be 21 83 0c ee 5e f2 27 01 f9' +
      '64 1a 44 18 d0 4c 04 14 ae ff 08 87 6b 34 ab 56' +
      'a1 d4 25 a1 22 58 33 54 9a db 84 1b 51 c9 b3 17' +
      '6a 27 2b de bb a1 d0 78 47 8f 62 b3 97 f3 3c 8d',
  },
];

for (let i = 0; i < HKDF_VECTORS.length; i++) {
  const t = HKDF_VECTORS[i];
  should(`HKDF vector (${i})`, () => {
    const PRK = hkdf_extract(t.hash, t.IKM, t.salt);
    assert.deepStrictEqual(PRK, t.PRK);
    const OKM = hkdf(t.hash, t.IKM, t.salt, t.info, t.L);
    assert.deepStrictEqual(OKM, t.OKM);
    assert.deepStrictEqual(hkdf(t.hash, t.IKM, t.salt, t.info, t.L, { cleanup: true }), t.OKM);
    assert.deepStrictEqual(hkdf(t.hash, t.IKM, t.salt, t.info, t.L, { cleanup: false }), t.OKM);
  });
}

for (let i = 0; i < SCRYPT_VECTORS.length; i++) {
  const t = SCRYPT_VECTORS[i];
  should(`Scrypt vector (${i})`, async () => {
    const exp = hexToBytes(t.exp.replace(/ /g, ''));
    assert.deepStrictEqual(scrypt(t.P, t.S, t), exp);
    assert.deepStrictEqual(await scryptAsync(t.P, t.S, t), exp);
    assert.deepStrictEqual(scrypt(t.P, t.S, { ...t, cleanup: true }), exp);
    assert.deepStrictEqual(await scryptAsync(t.P, t.S, { ...t, cleanup: true }), exp);
    assert.deepStrictEqual(scrypt(t.P, t.S, { ...t, cleanup: false }), exp);
    assert.deepStrictEqual(await scryptAsync(t.P, t.S, { ...t, cleanup: false }), exp);
  });
}

for (let i = 0; i < PBKDF2_VECTORS.length; i++) {
  const t = PBKDF2_VECTORS[i];
  should(`PBKDF2 vector (${i})`, async () => {
    const exp = hexToBytes(t.exp.replace(/ /g, ''));
    assert.deepStrictEqual(pbkdf2(t.hash, t.P, t.S, t), exp);
    assert.deepStrictEqual(await pbkdf2Async(t.hash, t.P, t.S, t), exp);
    assert.deepStrictEqual(pbkdf2(t.hash, t.P, t.S, { ...t, cleanup: true }), exp);
    assert.deepStrictEqual(await pbkdf2Async(t.hash, t.P, t.S, { ...t, cleanup: true }), exp);
    assert.deepStrictEqual(pbkdf2(t.hash, t.P, t.S, { ...t, cleanup: false }), exp);
    assert.deepStrictEqual(await pbkdf2Async(t.hash, t.P, t.S, { ...t, cleanup: false }), exp);
  });
}

should('PBKDF2 types', async () => {
  const opts = { c: 10, dkLen: 32 };
  pbkdf2(sha256, 'pwd', 'salt', opts);
  assert.throws(() => pbkdf2(sha256, 'pwd', 'salt', { c: 0, dkLen: 32 }), `pbkdf2(c=0)`);
  await assert.rejects(
    () => pbkdf2Async(sha256, 'pwd', 'salt', { c: 0, dkLen: 32 }),
    `pbkdf2(c=0)`
  );
  for (const t of TYPE_TEST.int) {
    assert.throws(() => pbkdf2(sha256, 'pwd', 'salt', { ...opts, c: t }), `pbkdf2(c=${t})`);
    await assert.rejects(
      () => pbkdf2Async(sha256, 'pwd', 'salt', { ...opts, c: t }),
      `pbkdf2(c=${t})`
    );
    assert.throws(() => pbkdf2(sha256, 'pwd', 'salt', { ...opts, dkLen: t }), `pbkdf2(dkLen=${t})`);
    await assert.rejects(
      () => pbkdf2Async(sha256, 'pwd', 'salt', { ...opts, dkLen: t }),
      `pbkdf2(dkLen=${t})`
    );
    await assert.rejects(
      () => pbkdf2Async(sha256, 'pwd', 'salt', { ...opts, asyncTick: t }),
      `pbkdf2(asyncTick=${t})`
    );
  }
  for (const t of TYPE_TEST.bytes.concat([undefined])) {
    assert.throws(() => pbkdf2(sha256, t, 'salt', opts), `pbkdf2(pwd=${t})`);
    await assert.rejects(() => pbkdf2Async(sha256, t, 'salt', opts), `pbkdf2(pwd=${t})`);
    assert.throws(() => pbkdf2(sha256, 'pwd', t, opts), `pbkdf2(salt=${t})`);
    await assert.rejects(() => pbkdf2Async(sha256, 'pwd', t, opts), `pbkdf2(salt=${t})`);
  }
  for (const t of TYPE_TEST.opts) {
    assert.throws(() => pbkdf2(sha256, 'pwd', 'salt', t), `pbkdf2(opt=${t})`);
    await assert.rejects(() => pbkdf2Async(sha256, 'pwd', 'salt', t), `pbkdf2(opt=${t})`);
  }
  for (const t of TYPE_TEST.hash) {
    assert.throws(() => pbkdf2(t, 'pwd', 'salt', t), `pbkdf2(hash=${t})`);
    await assert.rejects(() => pbkdf2Async(t, 'pwd', 'salt', t), `pbkdf2(hash=${t})`);
  }
  assert.deepStrictEqual(
    pbkdf2(sha256, SPACE.str, SPACE.str, opts),
    pbkdf2(sha256, SPACE.bytes, SPACE.bytes, opts),
    'pbkdf2.SPACE'
  );
  assert.deepStrictEqual(
    pbkdf2(sha256, EMPTY.str, EMPTY.str, opts),
    pbkdf2(sha256, EMPTY.bytes, EMPTY.bytes, opts),
    'pbkdf2.EMPTY'
  );
});

should('Scrypt types', async () => {
  const opt = { N: 1024, r: 8, p: 16, dkLen: 64 };
  scrypt('pwd', 'salt', opt);
  // N < 0 -> throws
  assert.throws(() => scrypt('pwd', 'salt', { ...opt, N: -2 }), `scrypt(N=-2)`);
  await assert.rejects(() => scryptAsync('pwd', 'salt', { ...opt, N: -2 }), `scrypt(N=-2)`);
  // N==0 -> throws (nodejs version is not, but it is against RFC)
  assert.throws(() => scrypt('pwd', 'salt', { ...opt, N: 0 }), `scrypt(N=0)`);
  await assert.rejects(() => scryptAsync('pwd', 'salt', { ...opt, N: 0 }), `scrypt(N=0)`);
  // N==1 -> throws
  assert.throws(() => scrypt('pwd', 'salt', { ...opt, N: 1 }), `scrypt(N=1)`);
  await assert.rejects(() => scryptAsync('pwd', 'salt', { ...opt, N: 1 }), `scrypt(N=1)`);
  for (const t of TYPE_TEST.int) {
    for (const k of ['N', 'r', 'p', 'dkLen']) {
      assert.throws(() => scrypt('pwd', 'salt', { ...opt, [k]: t }), `scrypt(${k}=${t})`);
      await assert.rejects(
        () => scryptAsync('pwd', 'salt', { ...opt, [k]: t }),
        `scrypt(${k}=${t})`
      );
    }
    await assert.rejects(
      () => scryptAsync('pwd', 'salt', { ...opt, asyncTick: t }),
      `scrypt(asyncTick=${t})`
    );
  }
  for (const t of TYPE_TEST.bytes.concat([undefined])) {
    assert.throws(() => scrypt('pwd', t, opt), `scrypt(salt=${t})`);
    await assert.rejects(() => scryptAsync('pwd', t, opt), `scrypt(salt=${t})`);
    assert.throws(() => scrypt(t, 'salt', opt), `scrypt(pwd=${t})`);
    await assert.rejects(() => scryptAsync(t, 'salt', opt), `scrypt(pwd=${t})`);
    for (const t of TYPE_TEST.opts) {
      assert.throws(() => scrypt('pwd', 'salt', t), `scrypt(opt=${t})`);
      await assert.rejects(() => scryptAsync('pwd', 'salt', t), `scrypt(opt=${t})`);
    }
  }
  assert.deepStrictEqual(
    scrypt(SPACE.str, SPACE.str, opt),
    scrypt(SPACE.bytes, SPACE.bytes, opt),
    'scrypt.SPACE'
  );
  assert.deepStrictEqual(
    scrypt(EMPTY.str, EMPTY.str, opt),
    scrypt(EMPTY.bytes, EMPTY.bytes, opt),
    'scrypt.EMPTY'
  );
});

should('HKDF types', () => {
  hkdf(sha256, '', '', '', 32);
  hkdf(sha256, '', '', '', 8160);
  assert.throws(() => hkdf(sha256, '', '', '', 8160 + 1), `hkdf.dkLen(8160 + 1)`);
  hkdf(sha512, '', '', '', 16320);
  assert.throws(() => hkdf(sha512, '', '', '', 16320 + 1), `hkdf.dkLen(16320 + 1)`);
  for (const t of TYPE_TEST.int) {
    assert.throws(() => hkdf(sha256, '', '', '', t), `hkdf.dkLen(${t})`);
  }
  for (const t of TYPE_TEST.bytes) {
    assert.throws(() => hkdf(sha256, t, '', '', 32), `hkdf.ikm(${t})`);
    assert.throws(() => hkdf(sha256, '', t, '', 32), `hkdf.salt(${t})`);
    assert.throws(() => hkdf(sha256, '', '', t, 32), `hkdf.info(${t})`);
  }
  // for (const t of TYPE_TEST.opts)
  //   assert.throws(() => hkdf(sha256, '', '', '', 32, t), `hkdf.opt(${t})`);
  assert.throws(() => hkdf(sha256, undefined, '', '', 32), 'hkdf.ikm===undefined');
  for (const t of TYPE_TEST.hash) assert.throws(() => hkdf(t, '', '', '', 32), `hkdf(hash=${t})`);

  assert.deepStrictEqual(
    hkdf(sha256, SPACE.str, SPACE.str, SPACE.str),
    hkdf(sha256, SPACE.bytes, SPACE.bytes, SPACE.bytes),
    'hkdf.SPACE'
  );
  assert.deepStrictEqual(
    hkdf(sha256, EMPTY.str, EMPTY.str, EMPTY.str),
    hkdf(sha256, EMPTY.bytes, EMPTY.bytes, EMPTY.bytes),
    'hkdf.EMPTY'
  );
});

executeKDFTests(true);

should('Scrypt maxmem', async () => {
  const opts = { N: 2 ** 10, r: 8, p: 16, dkLen: 64, maxmem: 128 * 8 * (2 ** 10 + 16) };
  scrypt('pwd', 'salt', opts);
  assert.throws(
    () => scrypt('pwd', 'salt', { ...opts, maxmem: opts.maxmem - 1 }),
    `scrypt(maxmem+=1)`
  );
  assert.throws(() => scrypt('pwd', 'salt', { ...opts, N: 2 ** 11 }), `scrypt(default maxmem)`);
});

if (require.main === module) should.run();
