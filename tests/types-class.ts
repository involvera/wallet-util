import {
    Mnemonic,
    PubKH,
    PubKey,
    Address,
    Signature,
    TxHash,
    PrivKey,
    InvBuffer,
} from '../src/involvera-types/index'

import { expect } from 'chai'
import { Sha256 } from '../ext_src/hash'

const DATA_TO_SIGN = Sha256('hello')
const WRONG_DATA_TO_SIGN = Sha256('hello2')
const MNEMONIC = "film dirt damage apart carry horse enroll carry power prison flush bulb"
const mnemonic = new Mnemonic(MNEMONIC)

describe('Testing Types Class', () => {

    it('Buffer', () => {
        const str = `[{"title":"A","content":"A1"},{"title":"A2","content":"A21"},{"title":"A22","content":"A221"},{"title":"A222","content":"A2221"},{"title":"A2222","content":"A22221"},{"title":"A22222","content":"A222221"},{"title":"A222222","content":"A2222221"},{"title":"A2222222","content":"A22222221"},{"title":"A22222222","content":"A222222221"},{"title":"A222222222","content":"A2222222221"}][{"title":"A","content":"A1"},{"title":"A2","content":"A21"},{"title":"A22","content":"A221"},{"title":"A222","content":"A2221"},{"title":"A2222","content":"A22221"},{"title":"A22222","content":"A222221"},{"title":"A222222","content":"A2222221"},{"title":"A2222222","content":"A22222221"},{"title":"A22222222","content":"A222222221"},{"title":"A222222222","content":"A2222222221"}]`
        const str64 = `W3sidGl0bGUiOiJBIiwiY29udGVudCI6IkExIn0seyJ0aXRsZSI6IkEyIiwiY29udGVudCI6IkEyMSJ9LHsidGl0bGUiOiJBMjIiLCJjb250ZW50IjoiQTIyMSJ9LHsidGl0bGUiOiJBMjIyIiwiY29udGVudCI6IkEyMjIxIn0seyJ0aXRsZSI6IkEyMjIyIiwiY29udGVudCI6IkEyMjIyMSJ9LHsidGl0bGUiOiJBMjIyMjIiLCJjb250ZW50IjoiQTIyMjIyMSJ9LHsidGl0bGUiOiJBMjIyMjIyIiwiY29udGVudCI6IkEyMjIyMjIxIn0seyJ0aXRsZSI6IkEyMjIyMjIyIiwiY29udGVudCI6IkEyMjIyMjIyMSJ9LHsidGl0bGUiOiJBMjIyMjIyMjIiLCJjb250ZW50IjoiQTIyMjIyMjIyMSJ9LHsidGl0bGUiOiJBMjIyMjIyMjIyIiwiY29udGVudCI6IkEyMjIyMjIyMjIxIn1dW3sidGl0bGUiOiJBIiwiY29udGVudCI6IkExIn0seyJ0aXRsZSI6IkEyIiwiY29udGVudCI6IkEyMSJ9LHsidGl0bGUiOiJBMjIiLCJjb250ZW50IjoiQTIyMSJ9LHsidGl0bGUiOiJBMjIyIiwiY29udGVudCI6IkEyMjIxIn0seyJ0aXRsZSI6IkEyMjIyIiwiY29udGVudCI6IkEyMjIyMSJ9LHsidGl0bGUiOiJBMjIyMjIiLCJjb250ZW50IjoiQTIyMjIyMSJ9LHsidGl0bGUiOiJBMjIyMjIyIiwiY29udGVudCI6IkEyMjIyMjIxIn0seyJ0aXRsZSI6IkEyMjIyMjIyIiwiY29udGVudCI6IkEyMjIyMjIyMSJ9LHsidGl0bGUiOiJBMjIyMjIyMjIiLCJjb250ZW50IjoiQTIyMjIyMjIyMSJ9LHsidGl0bGUiOiJBMjIyMjIyMjIyIiwiY29udGVudCI6IkEyMjIyMjIyMjIxIn1d`
        const str58 = `5eKDnsigbQKTenEbaoTNHrk3m5yfvvLzku1yhwRGBCgP9v8n8xagFpGZsEEFzJtosBzfuTKBfsoD4AHQQowxZ94gZTNFpugF2XQdJPHd5AfaHSfZ9U4YwDrtusFnMYgBYWJDufXn2tY53CKDpDif7RvNaFepzQ8m2dAhir7HiXDGeL4N4W3FYRjiUuY8DoybKP1NgUmwVtLYBqd6VHyp3KyzyfHT5dAwKvJh9YJmg4CMSNWMxaJTSzcHd6mU5hgGaAa8XWSN1NezWsbuTfrHYcLCTkHMoXsNi2vF8h8U84yKqVxbX6vCezh3Bpw7Lim6iiCRGi7VTy47Ui8pNFBGv5wJjj7e6pU8KvkvMTitTKTB65jaJq7oCDuAgMRbUzCxHaLidSxf5P6uvmah2kWQGHpxS9NiiXouM7JiVK9MZ9VyVCpsaTLMJd23kYWYoF2Fm5g4RVJ8Jfo3dJxm3ZS5GFxpD99zjosw4tNCDP5bQZ93T9JVofvqhwtru8urYHmcUWsYq7a2EE4p9LbL8ySt4rY4g4kN9mckxLCL8oFTmjHpqqPm7QGcjE5fVqQKStvtGVVMFmjYhCdJoerrVwJA2FnrFGowpWoxtVsoFRYDVwD47RAb2wCpVC7tcuGZ2wNiQ6jkWcKXtBvgVrb9Gc6sRTXahWbz8cHBvTxat3EuAmPv673DJpog8GTVYoy8zZM8LoQWR3TkaPWCDLmHAPiGEvRAVJCG7cMmsgvsmvZBuLaxkWmtYVzS5ijzoRL8X4mJHrBET2YEjN8CT9mdHX8L4dX2F2GFPUDeC7a7UQP6ybB4SuwuYawUvoKFqmUdoeupmrDzkj2EV3YK3Zf9697wu72u4tJSs2cAGFqqPvrmyPcGdzo1mByCHvbmWm7RwSSoR17o2iBhVq6u17uKHdKTq78hownwgkF64UupkwUJe2bZL7rMQJp9taJCfrzvK77JddPgsu6oLKfuoosTLdiP9uBamobRNhxH64gzwq3V3hwnFHQVYawuVLqMoFAPrGzsC5v4oX3fuahGVcAP6`
        const strhex = `5b7b227469746c65223a2241222c22636f6e74656e74223a224131227d2c7b227469746c65223a224132222c22636f6e74656e74223a22413231227d2c7b227469746c65223a22413232222c22636f6e74656e74223a2241323231227d2c7b227469746c65223a2241323232222c22636f6e74656e74223a224132323231227d2c7b227469746c65223a224132323232222c22636f6e74656e74223a22413232323231227d2c7b227469746c65223a22413232323232222c22636f6e74656e74223a2241323232323231227d2c7b227469746c65223a2241323232323232222c22636f6e74656e74223a224132323232323231227d2c7b227469746c65223a224132323232323232222c22636f6e74656e74223a22413232323232323231227d2c7b227469746c65223a22413232323232323232222c22636f6e74656e74223a2241323232323232323231227d2c7b227469746c65223a2241323232323232323232222c22636f6e74656e74223a224132323232323232323231227d5d5b7b227469746c65223a2241222c22636f6e74656e74223a224131227d2c7b227469746c65223a224132222c22636f6e74656e74223a22413231227d2c7b227469746c65223a22413232222c22636f6e74656e74223a2241323231227d2c7b227469746c65223a2241323232222c22636f6e74656e74223a224132323231227d2c7b227469746c65223a224132323232222c22636f6e74656e74223a22413232323231227d2c7b227469746c65223a22413232323232222c22636f6e74656e74223a2241323232323231227d2c7b227469746c65223a2241323232323232222c22636f6e74656e74223a224132323232323231227d2c7b227469746c65223a224132323232323232222c22636f6e74656e74223a22413232323232323231227d2c7b227469746c65223a22413232323232323232222c22636f6e74656e74223a2241323232323232323231227d2c7b227469746c65223a2241323232323232323232222c22636f6e74656e74223a224132323232323232323231227d5d`

        const braw = InvBuffer.fromRaw(str)
        const b58 = InvBuffer.from58(str58)
        const b64 = InvBuffer.from64(str64)
        const hex = InvBuffer.fromHex(strhex)

        expect(braw.to().string().raw()).to.eq(str)
        expect(braw.to().string().base58()).to.eq(str58)
        expect(braw.to().string().base64()).to.eq(str64)
        expect(braw.to().string().hex()).to.eq(strhex)

        expect(b58.to().string().raw()).to.eq(str)
        expect(b58.to().string().base58()).to.eq(str58)
        expect(b58.to().string().base64()).to.eq(str64)
        expect(b58.to().string().hex()).to.eq(strhex)

        expect(b64.to().string().raw()).to.eq(str)
        expect(b64.to().string().base58()).to.eq(str58)
        expect(b64.to().string().base64()).to.eq(str64)
        expect(b64.to().string().hex()).to.eq(strhex)

        expect(hex.to().string().raw()).to.eq(str)
        expect(hex.to().string().base58()).to.eq(str58)
        expect(hex.to().string().base64()).to.eq(str64)
        expect(hex.to().string().hex()).to.eq(strhex)

        expect(new InvBuffer(hex.bytes()).to().string().hex()).to.eq(strhex)
        expect(new InvBuffer(b64.bytes()).to().string().base64()).to.eq(str64)
        expect(new InvBuffer(b58.bytes()).to().string().base58()).to.eq(str58)
        expect(new InvBuffer(braw.bytes()).to().string().raw()).to.eq(str)

        expect(InvBuffer.FromStrings(str, str).to().string().raw()).to.eq(str+str)
        expect(InvBuffer.FromUint8s(braw.bytes(), braw.bytes()).to().string().raw()).to.eq(str+str)

        expect(InvBuffer.fromHex("abcdef1234").eq(InvBuffer.fromHex("abcdef1234"))).to.eq(true)
        expect(InvBuffer.fromHex("abcdef1234").eq(InvBuffer.fromHex("abcdef"))).to.eq(false)

    })

    it('Mnemonic', () => {
        expect(mnemonic.get()).to.eq(MNEMONIC)
        // private key hex
        expect(mnemonic.wallet().bytes().to().string().hex()).to.eq('0249bf24b309fbf1e085b5cb04a8df125da1f9296113d7536acf0d7ea17e9bbe')
        //public key hex
        expect(mnemonic.wallet().publicKey().to().string().hex()).to.eq('02615fbc5e5be930083ce6c0e5bf5ea6708e63027010b3efecc080799bdd553ed4')
        // public key hashed hex
        const pkh = mnemonic.wallet().publicKey().hash()
        expect(pkh.to().string().hex()).to.eq('86afca0f6f09860b21b5a17d73f2b511bf6828ed')
        //address
        expect(pkh.toAddress().get()).to.eq('1DHA8m54a1Vi3oR6LkqkkKYRBR9ZhPjZvC')
        //address shorted
        expect(pkh.toAddress().shorten()).to.eq("1DHA8m...hPjZvC")
        //public key base 58        
        expect(mnemonic.wallet().publicKey().to().string().base58()).to.eq('i1jxWwdRaJmaSX88ujc514GAHJVYty26ge1FcCuwiGPu')
    })

    it('Content Derivation', () => {
        const pk = mnemonic.deriveForContent(1)

        //private key hex
        expect(pk.bytes().to().string().hex()).to.eq('efa883b83151fa4e27b2ada3f46e9178cba501dd4c332cca0872048d2c73aedc')
        //public key hex
        expect(pk.publicKey().to().string().hex()).to.eq('03e26780f237b7325b5000bc526096dc1ef64b0a82b4d6d0de677f52179b11d784')
        //public key hashed hex
        const pkh = pk.publicKey().hash()
        expect(pkh.to().string().hex()).to.eq('631b7a738cf8f9aec8eeba7e9889a07d91be7d54')
        //address
        expect(pkh.toAddress().get()).to.eq('1A32pDgsgSe9c6xP6iNud1HtkJYFmShnbm')
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

        const sig3 = mnemonic.wallet().sign('Hello')
        expect(sig3.verify('Hello')).to.eq(true)
        expect(sig3.verify('hello')).to.eq(false)

        const sig4 = mnemonic.wallet().sign('Hello')
        expect(sig4.verifyWithPubK('Hello', mnemonic.wallet().publicKey())).to.eq(true)
        expect(sig4.verifyWithPubK('hello', mnemonic.wallet().publicKey())).to.eq(false)
        expect(sig4.verifyWithPubK('Hello', mnemonic.deriveForContent(1).publicKey())).to.eq(false)
    })

    it('Throw Errors', () => {
        expect(() => new Mnemonic("hello word super define include")).to.throw(Error)
        expect(() => new PubKH(new Uint8Array([100, 100,100,100,100]))).to.throw(Error)
        expect(() => new PubKey(new Uint8Array([100, 100,100,100,100]))).to.throw(Error)
        expect(() => new Signature(new Uint8Array([100, 100,100,100,100]))).to.throw(Error)
        expect(() => new Address("1JFK3290f22")).to.throw(Error)
        expect(() => new TxHash(new Uint8Array([100, 100,100,100,100]))).to.throw(Error)
    })

    it('Random values', () => {
        expect(() => Mnemonic.isValid(Mnemonic.random().get()))
        expect(() => PubKH.isValid(PubKH.random().bytes()))
        expect(() => PubKey.isValid(PubKey.random().bytes()))
        expect(() => Signature.isValid(Signature.random().bytes()))
        expect(() => Address.isValid(Address.random().get()))
        expect(() => TxHash.isValid(TxHash.random().bytes()))
        expect(() => PrivKey.random().sign('hello'))
    })

})