import * as nodeCrypto from 'crypto';
import { HexToBytes, ConcatBytes, UTF8ToBytes, RandomBytes } from '../hash'

// Global symbol available in browsers only. Ensure we do not depend on @types/dom
declare const self: Record<string, any> | undefined;
const crypto = {
  node: nodeCrypto,
  web: typeof self === 'object' && 'crypto' in self ? self.crypto : undefined,
};

const MD = { e: 'AES-GCM', i: { name: 'AES-GCM', length: 256 } };

export async function encrypt(sharedKey: Uint8Array, plaintext: string | Uint8Array) {
  if (typeof plaintext === 'string') plaintext = UTF8ToBytes(plaintext);
  const iv = RandomBytes(12);
  if (crypto.web) {
    const iKey = await crypto.web.subtle.importKey('raw', sharedKey, MD.i, true, ['encrypt']);
    const cipher = await crypto.web.subtle.encrypt({ name: MD.e, iv }, iKey, plaintext);
    const ciphertext = new Uint8Array(cipher);
    const encrypted = new Uint8Array(iv.length + ciphertext.byteLength);
    encrypted.set(iv, 0);
    encrypted.set(ciphertext, iv.length);
    return encrypted;
  } else {
    const cipher = crypto.node.createCipheriv('aes-256-gcm', sharedKey, iv);
    let ciphertext = cipher.update(plaintext, undefined, 'hex');
    ciphertext += cipher.final('hex');
    const ciphertextBytes = HexToBytes(ciphertext);
    const tag = cipher.getAuthTag();
    const encrypted = ConcatBytes(iv, ciphertextBytes, tag);
    return encrypted;
  }
}

export async function decrypt(sharedKey: Uint8Array, encoded: string | Uint8Array) {
  if (typeof encoded === 'string') encoded = HexToBytes(encoded);
  const iv = encoded.slice(0, 12);
  if (crypto.web) {
    const ciphertextWithTag = encoded.slice(12);
    const iKey = await crypto.web.subtle.importKey('raw', sharedKey, MD.i, true, ['decrypt']);
    const plaintext = await crypto.web.subtle.decrypt({ name: MD.e, iv }, iKey, ciphertextWithTag);
    return new Uint8Array(plaintext);
  } else {
    const ciphertext = encoded.slice(12, -16);
    const authTag = encoded.slice(-16);
    const decipher = crypto.node.createDecipheriv('aes-256-gcm', sharedKey, iv);
    decipher.setAuthTag(authTag);
    const plaintext = decipher.update(ciphertext);
    const final = Uint8Array.from(decipher.final());
    const res = ConcatBytes(plaintext, final);
    return res;
  }
}

declare const TextEncoder: any;
declare const TextDecoder: any;

const aes = { encrypt, decrypt };
export default aes;