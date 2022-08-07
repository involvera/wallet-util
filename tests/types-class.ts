import {
    Mnemonic,
} from '../src/types/index'

import { expect } from 'chai'
import { Sha256 } from '../src/hash'

const DATA_TO_SIGN = Sha256('hello')
const WRONG_DATA_TO_SIGN = Sha256('hello2')
const MNEMONIC = "film dirt damage apart carry horse enroll carry power prison flush bulb"
const mnemonic = new Mnemonic(MNEMONIC)

describe('Testing Types Class', () => {

    it('Mnemonic', () => {
        expect(mnemonic.get()).to.eq(MNEMONIC)
        //private key hex
        expect(mnemonic.wallet().bytes().toString('hex')).to.eq('0249bf24b309fbf1e085b5cb04a8df125da1f9296113d7536acf0d7ea17e9bbe')
        //public key hex
        expect(mnemonic.wallet().publicKey().to().string().hex()).to.eq('02615fbc5e5be930083ce6c0e5bf5ea6708e63027010b3efecc080799bdd553ed4')
        //public key hashed hex
        expect(mnemonic.wallet().publicKey().hash().to().string().hex()).to.eq('86afca0f6f09860b21b5a17d73f2b511bf6828ed')
        //address
        expect(mnemonic.wallet().publicKey().hash().toAddress().get()).to.eq('1DHA8m54a1Vi3oR6LkqkkKYRBR9ZhPjZvC')
        //address shorted
        expect(mnemonic.wallet().publicKey().hash().toAddress().shorten()).to.eq("1DHA8m...hPjZvC")
        //public key base 58        
        expect(mnemonic.wallet().publicKey().to().string().base58()).to.eq('i1jxWwdRaJmaSX88ujc514GAHJVYty26ge1FcCuwiGPu')
    })

    it('Content Derivation', () => {
        const pk = mnemonic.deriveForContent(1)

        //private key hex
        expect(pk.bytes().toString('hex')).to.eq('efa883b83151fa4e27b2ada3f46e9178cba501dd4c332cca0872048d2c73aedc')
        //public key hex
        expect(pk.publicKey().to().string().hex()).to.eq('03e26780f237b7325b5000bc526096dc1ef64b0a82b4d6d0de677f52179b11d784')
        //public key hashed hex
        expect(pk.publicKey().hash().to().string().hex()).to.eq('631b7a738cf8f9aec8eeba7e9889a07d91be7d54')
        //address
        expect(pk.publicKey().hash().toAddress().get()).to.eq('1A32pDgsgSe9c6xP6iNud1HtkJYFmShnbm')
        //public key base 58        
        expect(pk.publicKey().to().string().base58()).to.eq('29vjns9LmzCea8yCLaLUxfeq6A1QXCpdSnhQNKzZCzTXy')
    })

    it('Content Derivation', () => {
        const pk = mnemonic.deriveForContent(1)

        //private key hex
        expect(pk.bytes().toString('hex')).to.eq('efa883b83151fa4e27b2ada3f46e9178cba501dd4c332cca0872048d2c73aedc')
        //public key hex
        expect(pk.publicKey().to().string().hex()).to.eq('03e26780f237b7325b5000bc526096dc1ef64b0a82b4d6d0de677f52179b11d784')
        //public key hashed hex
        expect(pk.publicKey().hash().to().string().hex()).to.eq('631b7a738cf8f9aec8eeba7e9889a07d91be7d54')
        //address
        expect(pk.publicKey().hash().toAddress().get()).to.eq('1A32pDgsgSe9c6xP6iNud1HtkJYFmShnbm')
        //public key base 58        
        expect(pk.publicKey().to().string().base58()).to.eq('29vjns9LmzCea8yCLaLUxfeq6A1QXCpdSnhQNKzZCzTXy')
    })

    it('Signature', () => {
        const sig = mnemonic.wallet().sign(DATA_TO_SIGN)
        expect(sig.verify(DATA_TO_SIGN)).to.eq(true)
        expect(sig.verify(WRONG_DATA_TO_SIGN)).to.eq(false)

        const sig2 = mnemonic.wallet().sign(DATA_TO_SIGN)
        expect(sig2.verifyWithPubK(DATA_TO_SIGN, mnemonic.wallet().publicKey())).to.eq(true)
        expect(sig2.verifyWithPubK(WRONG_DATA_TO_SIGN, mnemonic.wallet().publicKey())).to.eq(false)
        expect(sig2.verifyWithPubK(DATA_TO_SIGN, mnemonic.deriveForContent(1).publicKey())).to.eq(false)
    })

})