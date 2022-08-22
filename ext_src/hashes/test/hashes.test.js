const assert = require('assert');
const { should } = require('micro-should');
const crypto = require('crypto');
const { sha256 } = require('../src/sha256');
const { sha384, sha512, sha512_256 } = require('../src/sha512');
const {
  sha3_224,
  sha3_256,
  sha3_384,
  sha3_512,
  keccak_256,
  shake128,
  shake256,
} = require('../src/sha3');
const { sha1 } = require('../src/sha1');
const { k12 } = require('../src/sha3-addons');
const { blake2b } = require('../src/blake2b');
const { blake2s } = require('../src/blake2s');
const { blake3 } = require('../src/blake3');
const { ripemd160 } = require('../src/ripemd160');
const { hmac } = require('../src/hmac');
const {
  utf8ToBytes,
  hexToBytes,
  repeat,
  concatBytes,
  TYPE_TEST,
  SPACE,
  EMPTY,
} = require('./utils');

// NIST test vectors (https://www.di-mgt.com.au/sha_testvectors.html)
const NIST_VECTORS = [
  [1, utf8ToBytes('abc')],
  [1, utf8ToBytes('')],
  [1, utf8ToBytes('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq')],
  [
    1,
    utf8ToBytes(
      'abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu'
    ),
  ],
  [1000000, utf8ToBytes('a')],
  // Very slow, 1GB
  //[16777216, utf8ToBytes('abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmno')],
].map(([r, buf]) => [r, buf, repeat(buf, r)]);

// Main idea: write 16k buffer with different values then test sliding window against node-js implementation
const testBuf = new Uint8Array(4096);
for (let i = 0; i < testBuf.length; i++) testBuf[i] = i;

const HASHES = {
  SHA1: {
    fn: sha1,
    obj: sha1.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha1').update(buf).digest()),
    node_obj: () => crypto.createHash('sha1'),
    nist: [
      'a9993e36 4706816a ba3e2571 7850c26c 9cd0d89d',
      'da39a3ee 5e6b4b0d 3255bfef 95601890 afd80709',
      '84983e44 1c3bd26e baae4aa1 f95129e5 e54670f1',
      'a49b2446 a02c645b f419f995 b6709125 3a04a259',
      '34aa973c d4c4daa4 f61eeb2b dbad2731 6534016f',
      '7789f0c9 ef7bfc40 d9331114 3dfbe69e 2017f592',
    ],
  },
  SHA256: {
    fn: sha256,
    obj: sha256.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha256').update(buf).digest()),
    node_obj: () => crypto.createHash('sha256'),
    nist: [
      'ba7816bf 8f01cfea 414140de 5dae2223 b00361a3 96177a9c b410ff61 f20015ad',
      'e3b0c442 98fc1c14 9afbf4c8 996fb924 27ae41e4 649b934c a495991b 7852b855',
      '248d6a61 d20638b8 e5c02693 0c3e6039 a33ce459 64ff2167 f6ecedd4 19db06c1',
      'cf5b16a7 78af8380 036ce59e 7b049237 0b249b11 e8f07a51 afac4503 7afee9d1',
      'cdc76e5c 9914fb92 81a1c7e2 84d73e67 f1809a48 a497200e 046d39cc c7112cd0',
      '50e72a0e 26442fe2 552dc393 8ac58658 228c0cbf b1d2ca87 2ae43526 6fcd055e',
    ],
  },
  SHA384: {
    fn: sha384,
    obj: sha384.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha384').update(buf).digest()),
    node_obj: () => crypto.createHash('sha384'),
    nist: [
      'cb00753f45a35e8b b5a03d699ac65007 272c32ab0eded163 1a8b605a43ff5bed 8086072ba1e7cc23 58baeca134c825a7',
      '38b060a751ac9638 4cd9327eb1b1e36a 21fdb71114be0743 4c0cc7bf63f6e1da 274edebfe76f65fb d51ad2f14898b95b',
      '3391fdddfc8dc739 3707a65b1b470939 7cf8b1d162af05ab fe8f450de5f36bc6 b0455a8520bc4e6f 5fe95b1fe3c8452b',
      '09330c33f71147e8 3d192fc782cd1b47 53111b173b3b05d2 2fa08086e3b0f712 fcc7c71a557e2db9 66c3e9fa91746039',
      '9d0e1809716474cb 086e834e310a4a1c ed149e9c00f24852 7972cec5704c2a5b 07b8b3dc38ecc4eb ae97ddd87f3d8985',
      '5441235cc0235341 ed806a64fb354742 b5e5c02a3c5cb71b 5f63fb793458d8fd ae599c8cd8884943 c04f11b31b89f023',
    ],
  },
  SHA512: {
    fn: sha512,
    obj: sha512.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha512').update(buf).digest()),
    node_obj: () => crypto.createHash('sha512'),
    nist: [
      'ddaf35a193617aba cc417349ae204131 12e6fa4e89a97ea2 0a9eeee64b55d39a 2192992a274fc1a8 36ba3c23a3feebbd 454d4423643ce80e 2a9ac94fa54ca49f',
      'cf83e1357eefb8bd f1542850d66d8007 d620e4050b5715dc 83f4a921d36ce9ce 47d0d13c5d85f2b0 ff8318d2877eec2f 63b931bd47417a81 a538327af927da3e',
      '204a8fc6dda82f0a 0ced7beb8e08a416 57c16ef468b228a8 279be331a703c335 96fd15c13b1b07f9 aa1d3bea57789ca0 31ad85c7a71dd703 54ec631238ca3445',
      '8e959b75dae313da 8cf4f72814fc143f 8f7779c6eb9f7fa1 7299aeadb6889018 501d289e4900f7e4 331b99dec4b5433a c7d329eeb6dd2654 5e96e55b874be909',
      'e718483d0ce76964 4e2e42c7bc15b463 8e1f98b13b204428 5632a803afa973eb de0ff244877ea60a 4cb0432ce577c31b eb009c5c2c49aa2e 4eadb217ad8cc09b',
      'b47c933421ea2db1 49ad6e10fce6c7f9 3d0752380180ffd7 f4629a712134831d 77be6091b819ed35 2c2967a2e2d4fa50 50723c9630691f1a 05a7281dbe6c1086',
    ],
  },
  SHA384: {
    fn: sha384,
    obj: sha384.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha384').update(buf).digest()),
    node_obj: () => crypto.createHash('sha384'),
    nist: [
      'cb00753f45a35e8b b5a03d699ac65007 272c32ab0eded163 1a8b605a43ff5bed 8086072ba1e7cc23 58baeca134c825a7',
      '38b060a751ac9638 4cd9327eb1b1e36a 21fdb71114be0743 4c0cc7bf63f6e1da 274edebfe76f65fb d51ad2f14898b95b',
      '3391fdddfc8dc739 3707a65b1b470939 7cf8b1d162af05ab fe8f450de5f36bc6 b0455a8520bc4e6f 5fe95b1fe3c8452b',
      '09330c33f71147e8 3d192fc782cd1b47 53111b173b3b05d2 2fa08086e3b0f712 fcc7c71a557e2db9 66c3e9fa91746039',
      '9d0e1809716474cb 086e834e310a4a1c ed149e9c00f24852 7972cec5704c2a5b 07b8b3dc38ecc4eb ae97ddd87f3d8985',
      '5441235cc0235341 ed806a64fb354742 b5e5c02a3c5cb71b 5f63fb793458d8fd ae599c8cd8884943 c04f11b31b89f023',
    ],
  },
  SHA512_256: {
    fn: sha512_256,
    obj: sha512_256.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha512-256').update(buf).digest()),
    node_obj: () => crypto.createHash('sha512-256'),
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => crypto.createHash('sha512-256').update(i[2]).digest('hex'))
    nist: [
      '53048e2681941ef99b2e29b76b4c7dabe4c2d0c634fc6d46e0e2f13107e7af23',
      'c672b8d1ef56ed28ab87c3622c5114069bdd3ad7b8f9737498d0c01ecef0967a',
      'bde8e1f9f19bb9fd3406c90ec6bc47bd36d8ada9f11880dbc8a22a7078b6a461',
      '3928e184fb8690f840da3988121d31be65cb9d3ef83ee6146feac861e19b563a',
      '9a59a052930187a97038cae692f30708aa6491923ef5194394dc68d56c74fb21',
    ],
  },
  SHA3_224: {
    fn: sha3_224,
    obj: sha3_224.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha3-224').update(buf).digest()),
    node_obj: () => crypto.createHash('sha3-224'),
    nist: [
      'e642824c3f8cf24a d09234ee7d3c766f c9a3a5168d0c94ad 73b46fdf',
      '6b4e03423667dbb7 3b6e15454f0eb1ab d4597f9a1b078e3f 5b5a6bc7',
      '8a24108b154ada21 c9fd5574494479ba 5c7e7ab76ef264ea d0fcce33',
      '543e6868e1666c1a 643630df77367ae5 a62a85070a51c14c bf665cbc',
      'd69335b93325192e 516a912e6d19a15c b51c6ed5c15243e7 a7fd653c',
      'c6d66e77ae289566 afb2ce39277752d6 da2a3c46010f1e0a 0970ff60',
    ],
  },
  SHA3_256: {
    fn: sha3_256,
    obj: sha3_256.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha3-256').update(buf).digest()),
    node_obj: () => crypto.createHash('sha3-256'),
    nist: [
      '3a985da74fe225b2 045c172d6bd390bd 855f086e3e9d525b 46bfe24511431532',
      'a7ffc6f8bf1ed766 51c14756a061d662 f580ff4de43b49fa 82d80a4b80f8434a',
      '41c0dba2a9d62408 49100376a8235e2c 82e1b9998a999e21 db32dd97496d3376',
      '916f6061fe879741 ca6469b43971dfdb 28b1a32dc36cb325 4e812be27aad1d18',
      '5c8875ae474a3634 ba4fd55ec85bffd6 61f32aca75c6d699 d0cdcb6c115891c1',
      'ecbbc42cbf296603 acb2c6bc0410ef43 78bafb24b710357f 12df607758b33e2b',
    ],
  },
  SHA3_384: {
    fn: sha3_384,
    obj: sha3_384.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha3-384').update(buf).digest()),
    node_obj: () => crypto.createHash('sha3-384'),
    nist: [
      'ec01498288516fc9 26459f58e2c6ad8d f9b473cb0fc08c25 96da7cf0e49be4b2 98d88cea927ac7f5 39f1edf228376d25',
      '0c63a75b845e4f7d 01107d852e4c2485 c51a50aaaa94fc61 995e71bbee983a2a c3713831264adb47 fb6bd1e058d5f004',
      '991c665755eb3a4b 6bbdfb75c78a492e 8c56a22c5c4d7e42 9bfdbc32b9d4ad5a a04a1f076e62fea1 9eef51acd0657c22',
      '79407d3b5916b59c 3e30b09822974791 c313fb9ecc849e40 6f23592d04f625dc 8c709b98b43b3852 b337216179aa7fc7',
      'eee9e24d78c18553 37983451df97c8ad 9eedf256c6334f8e 948d252d5e0e7684 7aa0774ddb90a842 190d2c558b4b8340',
      'a04296f4fcaae148 71bb5ad33e28dcf6 9238b04204d9941b 8782e816d014bcb7 540e4af54f30d578 f1a1ca2930847a12',
    ],
  },
  SHA3_512: {
    fn: sha3_512,
    obj: sha3_512.create,
    node: (buf) => Uint8Array.from(crypto.createHash('sha3-512').update(buf).digest()),
    node_obj: () => crypto.createHash('sha3-512'),
    nist: [
      'b751850b1a57168a 5693cd924b6b096e 08f621827444f70d 884f5d0240d2712e 10e116e9192af3c9 1a7ec57647e39340 57340b4cf408d5a5 6592f8274eec53f0',
      'a69f73cca23a9ac5 c8b567dc185a756e 97c982164fe25859 e0d1dcc1475c80a6 15b2123af1f5f94c 11e3e9402c3ac558 f500199d95b6d3e3 01758586281dcd26',
      '04a371e84ecfb5b8 b77cb48610fca818 2dd457ce6f326a0f d3d7ec2f1e91636d ee691fbe0c985302 ba1b0d8dc78c0863 46b533b49c030d99 a27daf1139d6e75e',
      'afebb2ef542e6579 c50cad06d2e578f9 f8dd6881d7dc824d 26360feebf18a4fa 73e3261122948efc fd492e74e82e2189 ed0fb440d187f382 270cb455f21dd185',
      '3c3a876da14034ab 60627c077bb98f7e 120a2a5370212dff b3385a18d4f38859 ed311d0a9d5141ce 9cc5c66ee689b266 a8aa18ace8282a0e 0db596c90b0a7b87',
      '235ffd53504ef836 a1342b488f483b39 6eabbfe642cf78ee 0d31feec788b23d0 d18d5c339550dd59 58a500d4b95363da 1b5fa18affc1bab2 292dc63b7d85097c',
    ],
  },
  SHAKE128: {
    fn: shake128,
    obj: shake128.create,
    node: (buf) => Uint8Array.from(crypto.createHash('shake128').update(buf).digest()),
    node_obj: () => crypto.createHash('shake128'),
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => crypto.createHash('shake128').update(i[2]).digest('hex'))
    nist: [
      '5881092dd818bf5cf8a3ddb793fbcba7',
      '7f9c2ba4e88f827d616045507605853e',
      '1a96182b50fb8c7e74e0a707788f55e9',
      '7b6df6ff181173b6d7898d7ff63fb07b',
      '9d222c79c4ff9d092cf6ca86143aa411',
    ],
  },
  SHAKE256: {
    fn: shake256,
    obj: shake256.create,
    node: (buf) => Uint8Array.from(crypto.createHash('shake256').update(buf).digest()),
    node_obj: () => crypto.createHash('shake256'),
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => crypto.createHash('shake256').update(i[2]).digest('hex'))
    nist: [
      '483366601360a8771c6863080cc4114d8db44530f8f1e1ee4f94ea37e78b5739',
      '46b9dd2b0ba88d13233b3feb743eeb243fcd52ea62b81b82b50c27646ed5762f',
      '4d8c2dd2435a0128eefbb8c36f6f87133a7911e18d979ee1ae6be5d4fd2e3329',
      '98be04516c04cc73593fef3ed0352ea9f6443942d6950e29a372a681c3deaf45',
      '3578a7a4ca9137569cdf76ed617d31bb994fca9c1bbf8b184013de8234dfd13a',
    ],
  },
  K12: {
    fn: k12,
    obj: k12.create,
    nist: [
      'ab174f328c55a5510b0b209791bf8b60e801a7cfc2aa42042dcb8f547fbe3a7d',
      '1ac2d450fc3b4205d19da7bfca1b37513c0803577ac7167f06fe2ce1f0ef39e5',
      '2793ae3461fb9fc82f149e30e229bedf126f4b07f332ebff034e514830d86a3a',
      'd63c8aec4058e7a4aa6700a2808bade5708f97770494c7edac657e51414700a4',
      'cc94c13dfb5859e99c0ad29136b059ee146f8b7bbabc833d1bba252c3579a120',
    ],
  },
  BLAKE2s: {
    fn: blake2s,
    obj: blake2s.create,
    node: (buf) => Uint8Array.from(crypto.createHash('blake2s256').update(buf).digest()),
    node_obj: () => crypto.createHash('blake2s256'),
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => crypto.createHash('blake2s256').update(i[2]).digest('hex'))
    nist: [
      '508c5e8c327c14e2e1a72ba34eeb452f37458b209ed63a294d999b4c86675982',
      '69217a3079908094e11121d042354a7c1f55b6482ca1a51e1b250dfd1ed0eef9',
      '6f4df5116a6f332edab1d9e10ee87df6557beab6259d7663f3bcd5722c13f189',
      '358dd2ed0780d4054e76cb6f3a5bce2841e8e2f547431d4d09db21b66d941fc7',
      'bec0c0e6cde5b67acb73b81f79a67a4079ae1c60dac9d2661af18e9f8b50dfa5',
    ],
  },
  BLAKE2b: {
    fn: blake2b,
    obj: blake2b.create,
    node: (buf) => Uint8Array.from(crypto.createHash('blake2b512').update(buf).digest()),
    node_obj: () => crypto.createHash('blake2b512'),
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => crypto.createHash('blake2b512').update(i[2]).digest('hex'))
    nist: [
      'ba80a53f981c4d0d6a2797b69f12f6e94c212f14685ac4b74b12bb6fdbffa2d17d87c5392aab792dc252d5de4533cc9518d38aa8dbf1925ab92386edd4009923',
      '786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce',
      '7285ff3e8bd768d69be62b3bf18765a325917fa9744ac2f582a20850bc2b1141ed1b3e4528595acc90772bdf2d37dc8a47130b44f33a02e8730e5ad8e166e888',
      'ce741ac5930fe346811175c5227bb7bfcd47f42612fae46c0809514f9e0e3a11ee1773287147cdeaeedff50709aa716341fe65240f4ad6777d6bfaf9726e5e52',
      '98fb3efb7206fd19ebf69b6f312cf7b64e3b94dbe1a17107913975a793f177e1d077609d7fba363cbba00d05f7aa4e4fa8715d6428104c0a75643b0ff3fd3eaf',
    ],
  },
  BLAKE3: {
    fn: blake3,
    obj: blake3.create,
    /*
    Generated by:
    JS: fs.writeFileSync('nist.json', JSON.stringify(require('./test/hashes.test.js').NIST_VECTORS.map(i=>Array.from(i[2]))))
    PYTHON:
    import json
    import blake3

    for v in [bytes(i) for i in json.loads(open('./nist.json').read())]:
        print('T', blake3.blake3(v).digest().hex())
    */
    nist: [
      '6437b3ac38465133ffb63b75273a8db548c558465d79db03fd359c6cd5bd9d85',
      'af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262',
      'c19012cc2aaf0dc3d8e5c45a1b79114d2df42abb2a410bf54be09e891af06ff8',
      '553e1aa2a477cb3166e6ab38c12d59f6c5017f0885aaf079f217da00cfca363f',
      '616f575a1b58d4c9797d4217b9730ae5e6eb319d76edef6549b46f4efe31ff8b',
    ],
  },
  KECCAK256: {
    fn: keccak_256,
    obj: keccak_256.create,
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => Buffer.from(require('js-sha3').keccak256.update(i[2]).digest()).toString('hex'))
    nist: [
      '4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45',
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      '45d3b367a6904e6e8d502ee04999a7c27647f91fa845d456525fd352ae3d7371',
      'f519747ed599024f3882238e5ab43960132572b7345fbeb9a90769dafd21ad67',
      'fadae6b49f129bbb812be8407b7b2894f34aecf6dbd1f9b0f0c7e9853098fc96',
    ],
  },
  RIPEMD160: {
    fn: ripemd160,
    obj: ripemd160.create,
    // Node.js 18 dropped support for RIPEMD160
    // node: (buf) => Uint8Array.from(crypto.createHash('ripemd160').update(buf).digest()),
    // node_obj: () => crypto.createHash('ripemd160'),
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => crypto.createHash('ripemd160').update(i[2]).digest().toString('hex'))
    // Matched against some vectors from https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
    nist: [
      '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc',
      '9c1185a5c5e9fc54612808977ee8f548b2258d31',
      '12a053384a9c0c88e405a06c27dcf49ada62eb2b',
      '6f3fa39b6b503c384f919a49a7aa5c2c08bdfb45',
      '52783243c1697bdbe16d37f97f68f08325dc1528',
    ],
  },
  // Hmac as hash
  'HMAC-SHA256': {
    fn: hmac.bind(null, sha256, new Uint8Array()),
    obj: hmac.create.bind(null, sha256, new Uint8Array()),
    node: (buf) =>
      Uint8Array.from(crypto.createHmac('sha256', new Uint8Array()).update(buf).digest()),
    node_obj: () => crypto.createHmac('sha256', new Uint8Array()),
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => crypto.createHmac('sha256', new Uint8Array()).update(i[2]).digest().toString('hex'))
    nist: [
      'fd7adb152c05ef80dccf50a1fa4c05d5a3ec6da95575fc312ae7c5d091836351',
      'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad',
      'e31c6a8c54f60655956375893317d0fb2c55615355747b0379bb3772d27d59d4',
      'b303b8328d855cc51960c6f56cd98a12c5100d570b52019f54639a09e15bafaa',
      'cc9b6be49d1512557cef495770bb61e46fce6e83af89d385a038c8c050f4609d',
    ],
  },
  'HMAC-SHA512': {
    fn: hmac.bind(null, sha512, new Uint8Array()),
    obj: hmac.create.bind(null, sha512, new Uint8Array()),
    node: (buf) =>
      Uint8Array.from(crypto.createHmac('sha512', new Uint8Array()).update(buf).digest()),
    node_obj: () => crypto.createHmac('sha512', new Uint8Array()),
    // There is no official vectors, so we created them via:
    // > NIST_VECTORS.map((i) => crypto.createHmac('sha512', new Uint8Array()).update(i[2]).digest().toString('hex'))
    nist: [
      '29689f6b79a8dd686068c2eeae97fd8769ad3ba65cb5381f838358a8045a358ee3ba1739c689c7805e31734fb6072f87261d1256995370d55725cba00d10bdd0',
      'b936cee86c9f87aa5d3c6f2e84cb5a4239a5fe50480a6ec66b70ab5b1f4ac6730c6c515421b327ec1d69402e53dfb49ad7381eb067b338fd7b0cb22247225d47',
      'e0657364f9603a276d94930f90a6b19f3ce4001ab494c4fdf7ff541609e05d2e48ca6454a4390feb12b8eacebb503ba2517f5e2454d7d77e8b44d7cca8f752cd',
      'ece33db7448f63f4d460ac8b86bdf02fa6f5c3279a2a5d59df26827bec5315a44eb85d40ee4df3a7272a9596a0bc27091466724e9357183e554c9ec5fdf6d099',
      '59064f29e00b6a5cc55a3b69d9cfd3457ae70bd169b2b714036ae3a965805eb25a99ca221ade1aecebe6111d70697d1174a288cd1bb177de4a14f06eacc631d8',
    ],
  },
};

let BUF_768 = new Uint8Array(256 * 3);
// Fill with random data
for (let i = 0; i < (256 * 3) / 32; i++)
  BUF_768.set(crypto.createHash('sha256').update(new Uint8Array(i)).digest(), i * 32);

function init() {
  for (const h in HASHES) {
    const hash = HASHES[h];
    // All hashes has NIST vectors, some generated manually
    for (let i = 0; i < NIST_VECTORS.length; i++) {
      if (!NIST_VECTORS[i]) continue;
      const [r, rbuf, buf] = NIST_VECTORS[i];
      should(`NIST: ${h} (${i})`, () => {
        assert.deepStrictEqual(
          hash.obj().update(buf).digest(),
          hexToBytes(hash.nist[i].replace(/ /g, ''))
        );
      });
      should(`NIST: ${h} (${i}) partial`, () => {
        const tmp = hash.obj();
        for (let j = 0; j < r; j++) tmp.update(rbuf);
        assert.deepStrictEqual(tmp.digest(), hexToBytes(hash.nist[i].replace(/ /g, '')));
      });
    }
    should(`accept string (${h})`, () => {
      const tmp = hash.obj().update('abc').digest();
      assert.deepStrictEqual(tmp, hexToBytes(hash.nist[0].replace(/ /g, '')));
    });
    should(`accept data in compact call form (${h}, string)`, () => {
      assert.deepStrictEqual(hash.fn('abc'), hexToBytes(hash.nist[0].replace(/ /g, '')));
    });
    should(`accept data in compact call form (${h}, u8array)`, () => {
      assert.deepStrictEqual(
        hash.fn(utf8ToBytes('abc')),
        hexToBytes(hash.nist[0].replace(/ /g, ''))
      );
    });
    should(`throw on update after digest (${h})`, () => {
      const tmp = hash.obj();
      tmp.update('abc').digest();
      assert.throws(() => tmp.update('abc'));
    });
    should(`throw on second digest call in cleanup mode (${h})`, () => {
      const tmp = hash.obj();
      tmp.update('abc').digest();
      assert.throws(() => tmp.digest());
    });
    should(`throw on wrong argument type`, () => {
      // Allowed only: undefined (for compact form only), string, Uint8Array
      for (const t of TYPE_TEST.bytes) {
        assert.throws(() => hash.fn(t), `compact(${t})`);
        assert.throws(() => hash.obj().update(t).digest(), `full(${t})`);
      }
      assert.throws(() => hash.fn(), `compact(undefined)`);
      assert.throws(() => hash.obj().update(undefined).digest(), `full(undefined)`);
      for (const t of TYPE_TEST.opts) assert.throws(() => hash.fn(undefined, t), `opt(${t})`);
    });
    should(`check types`, () => {
      assert.deepStrictEqual(hash.fn(SPACE.str), hash.fn(SPACE.bytes));
      assert.deepStrictEqual(hash.fn(EMPTY.str), hash.fn(EMPTY.bytes));
      assert.deepStrictEqual(
        hash.obj().update(SPACE.str).digest(),
        hash.obj().update(SPACE.bytes).digest()
      );
      assert.deepStrictEqual(
        hash.obj().update(EMPTY.str).digest(),
        hash.obj().update(EMPTY.bytes).digest()
      );
    });

    should(`Partial: ${h}`, () => {
      const fnH = hash.fn(BUF_768);
      for (let i = 0; i < 256; i++) {
        let b1 = BUF_768.subarray(0, i);
        for (let j = 0; j < 256; j++) {
          let b2 = BUF_768.subarray(i, i + j);
          let b3 = BUF_768.subarray(i + j);
          assert.deepStrictEqual(concatBytes(b1, b2, b3), BUF_768);
          assert.deepStrictEqual(hash.obj().update(b1).update(b2).update(b3).digest(), fnH);
        }
      }
    });
    // Same as before, but creates copy of each slice, which changes dataoffset of typed array
    // Catched bug in blake2
    should(`Partial (copy): ${h} partial`, () => {
      const fnH = hash.fn(BUF_768);
      for (let i = 0; i < 256; i++) {
        let b1 = BUF_768.subarray(0, i).slice();
        for (let j = 0; j < 256; j++) {
          let b2 = BUF_768.subarray(i, i + j).slice();
          let b3 = BUF_768.subarray(i + j).slice();
          assert.deepStrictEqual(concatBytes(b1, b2, b3), BUF_768);
          assert.deepStrictEqual(hash.obj().update(b1).update(b2).update(b3).digest(), fnH);
        }
      }
    });
    if (hash.node) {
      should(`Node: ${h}`, () => {
        for (let i = 0; i < testBuf.length; i++) {
          assert.deepStrictEqual(
            hash.obj().update(testBuf.subarray(0, i)).digest(),
            hash.node(testBuf.subarray(0, i))
          );
        }
      });
      should(`Node: ${h} chained`, () => {
        const b = new Uint8Array([1, 2, 3]);
        let nodeH = hash.node(b);
        let nobleH = hash.fn(b);
        for (let i = 0; i < 256; i++) {
          nodeH = hash.node(nodeH);
          nobleH = hash.fn(nobleH);
          assert.deepStrictEqual(nodeH, nobleH);
        }
      });
      should(`Node: ${h} partial`, () => {
        assert.deepStrictEqual(hash.fn(BUF_768), hash.node(BUF_768));
      });
    }
  }
}

module.exports = { init, HASHES, NIST_VECTORS };

if (require.main === module) {
  init();
  should.runParallel();
}
