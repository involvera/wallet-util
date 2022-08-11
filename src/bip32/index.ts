import { BIP32Factory } from './bip32' 

const ecc = require('tiny-secp256k1')
const BIP32 = BIP32Factory(ecc)

export {
    BIP32Interface,
    BIP32API,
    TinySecp256k1Interface,
} from './bip32';

export {
  BIP32Factory
}

export default BIP32