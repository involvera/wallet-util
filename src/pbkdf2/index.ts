var sizes = {
    sha1: 20,
    sha224: 28,
    sha256: 32,
    sha384: 48,
    sha512: 64,
    rmd160: 20,
    ripemd160: 20
  }
  import { CreateHmac} from "../hash"
  import { Buffer } from "../buffer"
  import checkParameters from './precondition'
  import toBuffer from './to-buffer'

  

  const pbkdf2 = (password: Buffer, salt: Buffer, iterations: number, keylen: number, digest: string | void) => {
    checkParameters(iterations, keylen)
    password = toBuffer(password, 'utf-8', 'Password')
    salt = toBuffer(salt, 'utf-8', 'Salt')
  
    digest = digest || 'sha1'
  
    var DK = Buffer.allocUnsafe(keylen)
    var block1 = Buffer.allocUnsafe(salt.length + 4)
    salt.copy(block1, 0, 0, salt.length)
  
    var destPos = 0
    var hLen = (sizes as any)[digest]
    var l = Math.ceil(keylen / hLen)
  
    for (var i = 1; i <= l; i++) {
      block1.writeUInt32BE(i, salt.length)
  
      var T = CreateHmac(digest, password, block1)
      var U = T
  
      for (var j = 1; j < iterations; j++) {
        U = CreateHmac(digest, password, U)
        for (var k = 0; k < hLen; k++) T[k] ^= U[k]
      }
  
      T.copy(DK, destPos)
      destPos += hLen
    }
  
    return DK
  }
  
export default pbkdf2