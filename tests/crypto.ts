import { 
    BuildSignature,
    VerifySignature,
    BuildSignatureHex,
    VerifySignatureHex
} from '../src/crypto'
import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import { NewMnemonic } from '../'
import { expect } from 'chai'
import { Buffer } from 'buffer'

const message = Buffer.from('Hello')
const wallet = bip32.fromSeed((bip39.mnemonicToSeedSync(NewMnemonic())))

describe('Testing signing/verifying', () => {

    it('BuildSignature / VerifySignature', () => {
        const sig = BuildSignature(wallet.privateKey as Buffer, message)
        expect(VerifySignature(message, sig, wallet.publicKey)).to.eq(true)
    })

    it('BuildSignatureHex / VerifySignatureHex', () => {
        const sig = BuildSignatureHex(wallet, message)
        expect(VerifySignatureHex(sig, message)).to.eq(true)
    })
})


