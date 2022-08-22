
import { encrypt, decrypt } from '../../ext_src/aes/index';
import { BytesToUTF8 } from '../../ext_src/hash'
import 'mocha';
import { expect } from 'chai'

describe('aes', () => {
    it('should encrypt and decrypt', async () => {
      const key = Uint8Array.from([
        64, 196, 127, 247, 172, 2, 34, 159, 6, 241, 30, 174, 183, 229, 41, 114, 253, 122, 119, 168, 177,
        243, 155, 236, 164, 159, 98, 72, 162, 243, 224, 195,
      ]);
      const plaintext = 'Hello world';
      const ciphertext = await encrypt(key, plaintext);
      const plaintext2 = await decrypt(key, ciphertext);
      expect(BytesToUTF8(plaintext2)).to.eq(plaintext)
    })
})
