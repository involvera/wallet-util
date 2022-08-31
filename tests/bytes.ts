import { expect } from 'chai';
import 'mocha';

import { Inv } from '../index'

const Buffer = Inv.InvBuffer
const { InvBigInt } = Inv

describe('Testing int encoding/decoding', () => {

    it('negative int8 1/4', () => {

        const INT_8 = BigInt(-45)
        const INT_8_BYTES = new Buffer([211])
        const INT_16_BYTES = new Buffer([211, 255])
        const INT_32_BYTES = new Buffer([211, 255, 255, 255])
        const INT_64_BYTES = new Buffer([211, 255, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT_8).to().string('int8').base64()).to.equal(INT_8_BYTES.to().string().base64() );
        expect(new InvBigInt(INT_8).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT_8).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT_8).to().bytes('int8').toString()).to.equal(INT_8_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_8_BYTES.to().int(true).big()).to.eq(INT_8)
        expect(INT_8_BYTES.to().int(true).number()).to.eq(Number(INT_8))
        expect(INT_8_BYTES.to().int(true).to().string('int8').base58()).to.eq(INT_8_BYTES.to().string().base58())
        expect(INT_8_BYTES.to().int(true).to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_8_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_8_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())

    });

    it('negative int8 2/4', () => {

        const INT_8 = BigInt(-117)
        const INT_8_BYTES = new Buffer([139])
        const INT_16_BYTES = new Buffer([139, 255])
        const INT_32_BYTES = new Buffer([139, 255, 255, 255])
        const INT_64_BYTES = new Buffer([139, 255, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT_8).to().string('int8').base64()).to.equal(INT_8_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT_8).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT_8).to().bytes('int8').toString()).to.equal(INT_8_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_8_BYTES.to().int(true).big()).to.eq(INT_8)
        expect(INT_8_BYTES.to().int(true).number()).to.eq(Number(INT_8))
        expect(INT_8_BYTES.to().int(true).to().string('int8').base58()).to.eq(INT_8_BYTES.to().string().base58())
        expect(INT_8_BYTES.to().int(true).to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_8_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_8_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())

    });

    it('negative int8 3/4', () => {
        const INT_8 = BigInt(-1)
        const INT_8_BYTES = new Buffer([255])
        const INT_16_BYTES = new Buffer([255, 255])
        const INT_32_BYTES = new Buffer([255, 255, 255, 255])
        const INT_64_BYTES = new Buffer([255, 255, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT_8).to().string('int8').base64()).to.equal(INT_8_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT_8).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT_8).to().bytes('int8').toString()).to.equal(INT_8_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_8_BYTES.to().int(true).big()).to.eq(INT_8)
        expect(INT_8_BYTES.to().int(true).number()).to.eq(Number(INT_8))
        expect(INT_8_BYTES.to().int(true).to().string('int8').base58()).to.eq(INT_8_BYTES.to().string().base58())
        expect(INT_8_BYTES.to().int(true).to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_8_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_8_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())

    });

    it('negative int8 4/4', () => {
        const INT_8 = BigInt(-19)
        const INT_8_BYTES = new Buffer([237])
        const INT_16_BYTES = new Buffer([237, 255])
        const INT_32_BYTES = new Buffer([237, 255, 255, 255])
        const INT_64_BYTES = new Buffer([237, 255, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT_8).to().string('int8').base64()).to.equal(INT_8_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT_8).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT_8).to().bytes('int8').toString()).to.equal(INT_8_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_8_BYTES.to().int(true).big()).to.eq(INT_8)
        expect(INT_8_BYTES.to().int(true).number()).to.eq(Number(INT_8))
        expect(INT_8_BYTES.to().int(true).to().string('int8').base58()).to.eq(INT_8_BYTES.to().string().base58())
        expect(INT_8_BYTES.to().int(true).to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_8_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_8_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('positive int8 1/4', () => {
        const INT_8 = BigInt(1)
        const INT_8_BYTES = new Buffer([1])
        const INT_16_BYTES = new Buffer([1, 0])
        const INT_32_BYTES = new Buffer([1, 0, 0, 0])
        const INT_64_BYTES = new Buffer([1, 0, 0, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT_8).to().string('int8').base64()).to.equal(INT_8_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT_8).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT_8).to().bytes('int8').toString()).to.equal(INT_8_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_8_BYTES.to().int().big()).to.eq(INT_8)
        expect(INT_8_BYTES.to().int().number()).to.eq(Number(INT_8))
        expect(INT_8_BYTES.to().int().to().string('int8').base58()).to.eq(INT_8_BYTES.to().string().base58())
        expect(INT_8_BYTES.to().int().to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_8_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_8_BYTES.to().int().to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('positive int8 2/4', () => {
        const INT_8 = BigInt(21)
        const INT_8_BYTES = new Buffer([21])
        const INT_16_BYTES = new Buffer([21, 0])
        const INT_32_BYTES = new Buffer([21, 0, 0, 0])
        const INT_64_BYTES = new Buffer([21, 0, 0, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT_8).to().string('int8').base64()).to.equal(INT_8_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT_8).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT_8).to().bytes('int8').toString()).to.equal(INT_8_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_8_BYTES.to().int().big()).to.eq(INT_8)
        expect(INT_8_BYTES.to().int().number()).to.eq(Number(INT_8))
        expect(INT_8_BYTES.to().int().to().string('int8').base58()).to.eq(INT_8_BYTES.to().string().base58())
        expect(INT_8_BYTES.to().int().to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_8_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_8_BYTES.to().int().to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('positive int8 3/4', () => {
        const INT_8 = BigInt(90)
        const INT_8_BYTES = new Buffer([90])
        const INT_16_BYTES = new Buffer([90, 0])
        const INT_32_BYTES = new Buffer([90, 0, 0, 0])
        const INT_64_BYTES = new Buffer([90, 0, 0, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT_8).to().string('int8').base64()).to.equal(INT_8_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT_8).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT_8).to().bytes('int8').toString()).to.equal(INT_8_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_8_BYTES.to().int().big()).to.eq(INT_8)
        expect(INT_8_BYTES.to().int().number()).to.eq(Number(INT_8))
        expect(INT_8_BYTES.to().int().to().string('int8').base58()).to.eq(INT_8_BYTES.to().string().base58())
        expect(INT_8_BYTES.to().int().to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_8_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_8_BYTES.to().int().to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('positive int8 4/4', () => {
        const INT_8 = BigInt(121)
        const INT_8_BYTES = new Buffer([121])
        const INT_16_BYTES = new Buffer([121, 0])
        const INT_32_BYTES = new Buffer([121, 0, 0, 0])
        const INT_64_BYTES = new Buffer([121, 0, 0, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT_8).to().string('int8').base64()).to.equal(INT_8_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT_8).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT_8).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT_8).to().bytes('int8').toString()).to.equal(INT_8_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT_8).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_8_BYTES.to().int().big()).to.eq(INT_8)
        expect(INT_8_BYTES.to().int().number()).to.eq(Number(INT_8))
        expect(INT_8_BYTES.to().int().to().string('int8').base58()).to.eq(INT_8_BYTES.to().string().base58())
        expect(INT_8_BYTES.to().int().to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_8_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_8_BYTES.to().int().to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });
    
    it('negative int16 1/4', () => {
        const INT = BigInt(-10_032)
        const INT_16_BYTES = new Buffer([208, 216])
        const INT_32_BYTES = new Buffer([208, 216, 255, 255])
        const INT_64_BYTES = new Buffer([208, 216, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_16_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_16_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_16_BYTES.to().int(true).to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_16_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_16_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('negative int16 2/4', () => {
        const INT = BigInt(-549)
        const INT_16_BYTES = new Buffer([219, 253])
        const INT_32_BYTES = new Buffer([219, 253, 255, 255])
        const INT_64_BYTES = new Buffer([219, 253, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_16_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_16_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_16_BYTES.to().int(true).to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_16_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_16_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        
    });

    it('negative int16 3/4', () => {
        const INT = BigInt(-3_921)
        const INT_16_BYTES = new Buffer([175, 240])
        const INT_32_BYTES = new Buffer([175, 240, 255, 255])
        const INT_64_BYTES = new Buffer([175, 240, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_16_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_16_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_16_BYTES.to().int(true).to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_16_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_16_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('negative int16 4/4', () => {
        const INT = BigInt(-29_301)
        const INT_16_BYTES = new Buffer([139, 141])
        const INT_32_BYTES = new Buffer([139, 141, 255, 255])
        const INT_64_BYTES = new Buffer([139, 141, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_16_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_16_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_16_BYTES.to().int(true).to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_16_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_16_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('positive int16 1/4', () => {
        const INT = BigInt(9_853)
        const INT_16_BYTES = new Buffer([125, 38])
        const INT_32_BYTES = new Buffer([125, 38, 0, 0])
        const INT_64_BYTES = new Buffer([125, 38, 0, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_16_BYTES.to().int().big()).to.eq(INT)
        expect(INT_16_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_16_BYTES.to().int().to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_16_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_16_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())

        //Error
        expect(() => INT_16_BYTES.to().int(true).to().string('int8').base64()).to.throw(Error)
    });

    it('positive int16 2/4', () => {
        const INT = BigInt(128)
        const INT_16_BYTES = new Buffer([128, 0])
        const INT_32_BYTES = new Buffer([128, 0, 0, 0])
        const INT_64_BYTES = new Buffer([128, 0, 0, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_16_BYTES.to().int().big()).to.eq(INT)
        expect(INT_16_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_16_BYTES.to().int().to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_16_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_16_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('positive int16 3/4', () => {
        const INT = BigInt(32_103)
        const INT_16_BYTES = new Buffer([103, 125])
        const INT_32_BYTES = new Buffer([103, 125, 0, 0])
        const INT_64_BYTES = new Buffer([103, 125, 0, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_16_BYTES.to().int().big()).to.eq(INT)
        expect(INT_16_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_16_BYTES.to().int().to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_16_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_16_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('positive int16 4/4', () => {
        const INT = BigInt(4_120)
        const INT_16_BYTES = new Buffer([24, 16])
        const INT_32_BYTES = new Buffer([24, 16, 0, 0])
        const INT_64_BYTES = new Buffer([24, 16, 0, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int16').hex()).to.equal(INT_16_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int16').toString()).to.equal(INT_16_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_16_BYTES.to().int().big()).to.eq(INT)
        expect(INT_16_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_16_BYTES.to().int().to().string('int16').base64()).to.eq(INT_16_BYTES.to().string().base64())
        expect(INT_16_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_16_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('negative int32 1/4', () => {
        const INT = BigInt(-32_769)
        const INT_32_BYTES = new Buffer([255, 127, 255, 255])
        const INT_64_BYTES = new Buffer([255, 127, 255, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_32_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_32_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_32_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_32_BYTES.to().int(true).to().string('int32').base58()).to.eq(INT_32_BYTES.to().string().base58())
        expect(INT_32_BYTES.to().int(true).to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_32_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('negative int32 2/4', () => {
        const INT = BigInt(-1_349_003)
        const INT_32_BYTES = new Buffer([117, 106, 235, 255])
        const INT_64_BYTES = new Buffer([117, 106, 235, 255, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_32_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_32_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_32_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_32_BYTES.to().int(true).to().string('int32').base58()).to.eq(INT_32_BYTES.to().string().base58())
        expect(INT_32_BYTES.to().int(true).to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_32_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('negative int32 3/4', () => {
        const INT = BigInt(-123_456_789)
        const INT_32_BYTES = new Buffer([235, 50, 164, 248])
        const INT_64_BYTES = new Buffer([235, 50, 164, 248, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_32_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_32_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_32_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_32_BYTES.to().int(true).to().string('int32').base58()).to.eq(INT_32_BYTES.to().string().base58())
        expect(INT_32_BYTES.to().int(true).to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_32_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('negative int32 4/4', () => {
        const INT = BigInt(-2_047_483_648)
        const INT_32_BYTES = new Buffer([0, 225, 245, 133])
        const INT_64_BYTES = new Buffer([0, 225, 245, 133, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_32_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_32_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_32_BYTES.to().int(true).to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_32_BYTES.to().int(true).to().string('int32').base58()).to.eq(INT_32_BYTES.to().string().base58())
        expect(INT_32_BYTES.to().int(true).to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_32_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
    });

    it('positive int32 1/4', () => {
        const INT = BigInt(96_003)
        const INT_32_BYTES = new Buffer([3, 119, 1, 0])
        const INT_64_BYTES = new Buffer([3, 119, 1, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_32_BYTES.to().int().big()).to.eq(INT)
        expect(INT_32_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_32_BYTES.to().int().to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_32_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_32_BYTES.to().int().to().string('int32').raw()).to.eq(INT_32_BYTES.to().string().raw())
        expect(INT_32_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('positive int32 2/4', () => {
        const INT = BigInt(933_312_343)
        const INT_32_BYTES = new Buffer([87, 55, 161, 55])
        const INT_64_BYTES = new Buffer([87, 55, 161, 55, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_32_BYTES.to().int().big()).to.eq(INT)
        expect(INT_32_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_32_BYTES.to().int().to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_32_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_32_BYTES.to().int().to().string('int32').raw()).to.eq(INT_32_BYTES.to().string().raw())
        expect(INT_32_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('positive int32 3/4', () => {
        const INT = BigInt(7_999_999)
        const INT_32_BYTES = new Buffer([255, 17, 122, 0])
        const INT_64_BYTES = new Buffer([255, 17, 122, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_32_BYTES.to().int().big()).to.eq(INT)
        expect(INT_32_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_32_BYTES.to().int().to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_32_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_32_BYTES.to().int().to().string('int32').raw()).to.eq(INT_32_BYTES.to().string().raw())
        expect(INT_32_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('positive int32 4/4', () => {
        const INT = BigInt(12_000_000)
        const INT_32_BYTES = new Buffer([0, 27, 183, 0])
        const INT_64_BYTES = new Buffer([0, 27, 183, 0, 0, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int32').base64()).to.equal(INT_32_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());

        expect(new InvBigInt(INT).to().bytes('int32').toString()).to.equal(INT_32_BYTES.toString());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_32_BYTES.to().int().big()).to.eq(INT)
        expect(INT_32_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_32_BYTES.to().int().to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_32_BYTES.to().int().to().string('int32').hex()).to.eq(INT_32_BYTES.to().string().hex())
        expect(INT_32_BYTES.to().int().to().string('int32').raw()).to.eq(INT_32_BYTES.to().string().raw())
        expect(INT_32_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });
    
    it('negative int64 1/4', () => {
        const INT = BigInt(-2_147_483_649)
        const INT_64_BYTES = new Buffer([255,255 ,255, 127, 255, 255, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int64').base64()).to.equal(INT_64_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_64_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_64_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_64_BYTES.to().int(true).to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_64_BYTES.to().int(true).to().string('int64').hex()).to.eq(INT_64_BYTES.to().string().hex())
        expect(INT_64_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        expect(INT_64_BYTES.to().int(true).to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });
    
    it('negative int64 2/4', () => {
        const INT = BigInt(-5_036_854_775_808)
        const INT_64_BYTES = new Buffer([0, 112, 15, 68 ,107, 251, 255, 255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int64').base64()).to.equal(INT_64_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_64_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_64_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_64_BYTES.to().int(true).to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_64_BYTES.to().int(true).to().string('int64').hex()).to.eq(INT_64_BYTES.to().string().hex())
        expect(INT_64_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        expect(INT_64_BYTES.to().int(true).to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('negative int64 3/4', () => {
        const INT = BigInt(-9_223_372_036_854_775_808)
        const INT_64_BYTES = new Buffer([0, 0, 0 ,0 ,0, 0, 0 ,128])

        //Encoding
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int64').base64()).to.equal(INT_64_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_64_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_64_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_64_BYTES.to().int(true).to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_64_BYTES.to().int(true).to().string('int64').hex()).to.eq(INT_64_BYTES.to().string().hex())
        expect(INT_64_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        expect(INT_64_BYTES.to().int(true).to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('negative int64 4/4', () => {
        const INT = BigInt(-223_854_775_808)
        const INT_64_BYTES = new Buffer([0, 50 ,55 ,225, 203, 255 ,255 ,255])

        //Encoding
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().string('int64').base64()).to.equal(INT_64_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_64_BYTES.to().int(true).big()).to.eq(INT)
        expect(INT_64_BYTES.to().int(true).number()).to.eq(Number(INT))
        expect(INT_64_BYTES.to().int(true).to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_64_BYTES.to().int(true).to().string('int64').hex()).to.eq(INT_64_BYTES.to().string().hex())
        expect(INT_64_BYTES.to().int(true).to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        expect(INT_64_BYTES.to().int(true).to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });


    const RAND_POS_INT_64_1 = BigInt(4_294_967_297)
    const RAND_POS_INT_64_2 = BigInt(9_036_854_775_807)
    const RAND_POS_INT_64_3 = BigInt("9372036854775807")
    const RAND_POS_INT_64_4 = BigInt(9_000_000_000_000)
    
    const RAND_POS_INT_64_1_BYTES = new Buffer([1, 0, 0, 0, 1, 0, 0, 0])
    const RAND_POS_INT_64_2_BYTES = new Buffer([255, 207, 132, 14, 56, 8, 0, 0])
    const RAND_POS_INT_64_3_BYTES = new Buffer([255, 255, 140, 95, 209, 75, 33, 0])
    const RAND_POS_INT_64_4_BYTES = new Buffer([0 ,144, 205, 121, 47, 8, 0, 0])
    

    it('positive int64 1/4', () => {
        const INT = BigInt(4_294_967_297)
        const INT_64_BYTES = new Buffer([1, 0, 0, 0, 1, 0, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int64').base64()).to.equal(INT_64_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_64_BYTES.to().int().big()).to.eq(INT)
        expect(INT_64_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_64_BYTES.to().int().to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_64_BYTES.to().int().to().string('int64').hex()).to.eq(INT_64_BYTES.to().string().hex())
        expect(INT_64_BYTES.to().int().to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        expect(INT_64_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('positive int64 2/4', () => {
        const INT = BigInt(9_036_854_775_807)
        const INT_64_BYTES = new Buffer([255, 207, 132, 14, 56, 8, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int64').base64()).to.equal(INT_64_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_64_BYTES.to().int().big()).to.eq(INT)
        expect(INT_64_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_64_BYTES.to().int().to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_64_BYTES.to().int().to().string('int64').hex()).to.eq(INT_64_BYTES.to().string().hex())
        expect(INT_64_BYTES.to().int().to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        expect(INT_64_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('positive int64 3/4', () => {
        const INT = BigInt("9372036854775807")
        const INT_64_BYTES = new Buffer([255, 255, 140, 95, 209, 75, 33, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int64').base64()).to.equal(INT_64_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_64_BYTES.to().int().big()).to.eq(INT)
        expect(INT_64_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_64_BYTES.to().int().to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_64_BYTES.to().int().to().string('int64').hex()).to.eq(INT_64_BYTES.to().string().hex())
        expect(INT_64_BYTES.to().int().to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        expect(INT_64_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('positive int64 4/4', () => {
        const INT = BigInt(9_000_000_000_000)
        const INT_64_BYTES = new Buffer([0 ,144, 205, 121, 47, 8, 0, 0])

        //Encoding
        expect(new InvBigInt(INT).to().string('int64').base64()).to.equal(INT_64_BYTES.to().string().base64());
        expect(new InvBigInt(INT).to().string('int64').hex()).to.equal(INT_64_BYTES.to().string().hex());
        expect(new InvBigInt(INT).to().bytes('int64').toString()).to.equal(INT_64_BYTES.toString());

        //Decoding
        expect(INT_64_BYTES.to().int().big()).to.eq(INT)
        expect(INT_64_BYTES.to().int().number()).to.eq(Number(INT))
        expect(INT_64_BYTES.to().int().to().string('int64').base64()).to.eq(INT_64_BYTES.to().string().base64())
        expect(INT_64_BYTES.to().int().to().string('int64').hex()).to.eq(INT_64_BYTES.to().string().hex())
        expect(INT_64_BYTES.to().int().to().string('int64').raw()).to.eq(INT_64_BYTES.to().string().raw())
        expect(INT_64_BYTES.to().int().to().string('int64').base58()).to.eq(INT_64_BYTES.to().string().base58())
    });

    it('max int8', () => {
        const MAX_INT_8 = BigInt(127)
        const MAX_INT_8_BYTES = new Buffer([127, 0, 0 ,0])

        expect(new InvBigInt(MAX_INT_8).to().bytes('int32').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int().big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int().number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int().to().string('int32').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });

    it('max int16', () => {
        const MAX_INT_16 = BigInt(32_767)
        const MAX_INT_16_BYTES = new Buffer([255 ,127, 0, 0])

        expect(new InvBigInt(MAX_INT_16).to().bytes('int32').toString()).to.equal(MAX_INT_16_BYTES.toString());
        expect(MAX_INT_16_BYTES.to().int().big()).to.eq(MAX_INT_16)
        expect(MAX_INT_16_BYTES.to().int().number()).to.eq(Number(MAX_INT_16))
        expect(MAX_INT_16_BYTES.to().int().to().string('int32').base64()).to.eq(MAX_INT_16_BYTES.to().string().base64())
    });

    it('max int32', () => {
        const MAX_INT_16 = BigInt(2_147_483_647)
        const MAX_INT_16_BYTES = new Buffer([255 ,255 ,255, 127])

        expect(new InvBigInt(MAX_INT_16).to().bytes('int32').toString()).to.equal(MAX_INT_16_BYTES.toString());
        expect(MAX_INT_16_BYTES.to().int().big()).to.eq(MAX_INT_16)
        expect(MAX_INT_16_BYTES.to().int().number()).to.eq(Number(MAX_INT_16))
        expect(MAX_INT_16_BYTES.to().int().to().string('int32').base64()).to.eq(MAX_INT_16_BYTES.to().string().base64())
    });

    it('max int64', () => {
        const MAX_INT_16 = BigInt("9223372036854775807")
        const MAX_INT_16_BYTES = new Buffer([255 ,255, 255, 255, 255, 255, 255, 127])

        expect(new InvBigInt(MAX_INT_16).to().bytes('int64').toString()).to.equal(MAX_INT_16_BYTES.toString());
        expect(MAX_INT_16_BYTES.to().int().big()).to.eq(MAX_INT_16)
        expect(MAX_INT_16_BYTES.to().int().number()).to.eq(Number(MAX_INT_16))
        expect(MAX_INT_16_BYTES.to().int().to().string('int64').base64()).to.eq(MAX_INT_16_BYTES.to().string().base64())
    });

    it('min int8', () => {
        const MAX_INT_8_BYTES = new Buffer([128, 255, 255, 255])
        const MAX_INT_8 = BigInt(-128)

        expect(new InvBigInt(MAX_INT_8).to().bytes('int32').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int(true).big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int(true).number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int(true).to().string('int32').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });

    it('min int16', () => {
        const MAX_INT_8_BYTES = new Buffer([0, 128, 255, 255])
        const MAX_INT_8 = BigInt(-32_768)

        expect(new InvBigInt(MAX_INT_8).to().bytes('int32').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int(true).big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int(true).number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int(true).to().string('int32').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });

    it('min int32', () => {
        const MAX_INT_8_BYTES = new Buffer([0, 0, 0 ,128])
        const MAX_INT_8 = BigInt(-2_147_483_648)

        expect(new InvBigInt(MAX_INT_8).to().bytes('int32').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int(true).big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int(true).number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int(true).to().string('int32').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });

    it('min int64', () => {
        const MAX_INT_8_BYTES = new Buffer([0, 0, 0, 0, 0, 0, 0, 128])
        const MAX_INT_8 = BigInt("-9223372036854775808")

        expect(new InvBigInt(MAX_INT_8).to().bytes('int64').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int(true).big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int(true).number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int(true).to().string('int64').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });

    it('max uint8', () => {
        const MAX_INT_8_BYTES = new Buffer([255, 0, 0 ,0])
        const INT_BYTES_2 = new Buffer([255])
        const MAX_INT_8 = BigInt(255)

        expect(new InvBigInt(MAX_INT_8).to().bytes('uint8').to().string().raw()).to.equal(INT_BYTES_2.to().string().raw());
        expect(new InvBigInt(MAX_INT_8).to().bytes('int32').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int().big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int().number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int().to().string('int32').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });

    it('max uint16', () => {
        const MAX_INT_8_BYTES = new Buffer([255, 255, 0 ,0])
        const INT_BYTES_2 = new Buffer([255, 255])
        const MAX_INT_8 = BigInt(65_535)

        expect(new InvBigInt(MAX_INT_8).to().bytes('uint16').to().string().raw()).to.equal(INT_BYTES_2.to().string().raw());
        expect(new InvBigInt(MAX_INT_8).to().bytes('int32').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int().big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int().number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int().to().string('int32').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });

    it('max uint32', () => {
        const MAX_INT_8_BYTES = new Buffer([255, 255, 255, 255])
        const MAX_INT_8 = BigInt(4294967295)

        expect(new InvBigInt(MAX_INT_8).to().bytes('uint32').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int().big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int().number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int().to().string('uint32').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });

    it('max uint64', () => {
        const MAX_INT_8_BYTES = new Buffer([255, 255, 255, 255, 255,255,255,255])
        const MAX_INT_8 = BigInt("18446744073709551615")

        expect(new InvBigInt(MAX_INT_8).to().bytes('uint64').toString()).to.equal(MAX_INT_8_BYTES.toString());
        expect(MAX_INT_8_BYTES.to().int().big()).to.eq(MAX_INT_8)
        expect(MAX_INT_8_BYTES.to().int().number()).to.eq(Number(MAX_INT_8))
        expect(MAX_INT_8_BYTES.to().int().to().string('uint64').base64()).to.eq(MAX_INT_8_BYTES.to().string().base64())
    });


    it('Throw errors', () => {

        const NEG_INT_8 = BigInt(-45)
        const NEG_INT_16 = BigInt(-4_500)
        const NEG_INT_32 = BigInt(-45_000_000)
        const NEG_INT_64 = BigInt(-45_000_000_000)

        const POS_INT_8 = BigInt(45)
        const POS_INT_16 = BigInt(4_500)
        const POS_INT_32 = BigInt(45_000_000)
        const POS_INT_64 = BigInt(45_000_000_000)

        const MAX_UINT_8 = BigInt(255)
        const MAX_UINT_16 = BigInt(65_535)
        const MAX_UINT_32 = BigInt(4294967295)
        const MAX_UINT_64 = BigInt("18446744073709551615")

        const MIN_INT_8 = BigInt(-128)
        const MIN_INT_16 = BigInt(-32_768)
        const MIN_INT_32 = BigInt(-2_147_483_648)
        const MIN_INT_64 = BigInt("-9223372036854775808")

        //Negative ints
        expect(() => new InvBigInt(NEG_INT_8).to().bytes('int8').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(NEG_INT_8).to().bytes('uint8').toString()).to.throw(Error)

        expect(() => new InvBigInt(NEG_INT_16).to().bytes('int8').toString()).to.throw(Error)
        expect(() => new InvBigInt(NEG_INT_16).to().bytes('int16').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(NEG_INT_16).to().bytes('uint16').toString()).to.throw(Error)

        expect(() => new InvBigInt(NEG_INT_32).to().bytes('int16').toString()).to.throw(Error)
        expect(() => new InvBigInt(NEG_INT_32).to().bytes('int32').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(NEG_INT_32).to().bytes('uint32').toString()).to.throw(Error)

        expect(() => new InvBigInt(NEG_INT_64).to().bytes('int32').toString()).to.throw(Error)
        expect(() => new InvBigInt(NEG_INT_64).to().bytes('uint32').toString()).to.throw(Error)
        expect(() => new InvBigInt(NEG_INT_64).to().bytes('int64').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(NEG_INT_64).to().bytes('uint64').toString()).to.throw(Error)

        //Positive ints
        expect(() => new InvBigInt(POS_INT_8).to().bytes('int8').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(POS_INT_8).to().bytes('uint8').toString()).to.not.throw(Error)

        expect(() => new InvBigInt(POS_INT_16).to().bytes('int8').toString()).to.throw(Error)
        expect(() => new InvBigInt(POS_INT_16).to().bytes('uint8').toString()).to.throw(Error)
        expect(() => new InvBigInt(POS_INT_16).to().bytes('int16').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(POS_INT_16).to().bytes('uint16').toString()).to.not.throw(Error)

        expect(() => new InvBigInt(POS_INT_32).to().bytes('int16').toString()).to.throw(Error)
        expect(() => new InvBigInt(POS_INT_32).to().bytes('uint16').toString()).to.throw(Error)
        expect(() => new InvBigInt(POS_INT_32).to().bytes('int32').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(POS_INT_32).to().bytes('uint32').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(POS_INT_32).to().bytes('int64').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(POS_INT_32).to().bytes('uint64').toString()).to.not.throw(Error)

        expect(() => new InvBigInt(POS_INT_64).to().bytes('int32').toString()).to.throw(Error)
        expect(() => new InvBigInt(POS_INT_64).to().bytes('uint32').toString()).to.throw(Error)
        expect(() => new InvBigInt(POS_INT_64).to().bytes('int64').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(POS_INT_64).to().bytes('uint64').toString()).to.not.throw(Error)

        //MAX UINTS
        expect(() => new InvBigInt(MAX_UINT_8).to().bytes('int8').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_8).to().bytes('uint8').toString()).to.not.throw(Error)

        expect(() => new InvBigInt(MAX_UINT_16).to().bytes('int8').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_16).to().bytes('uint8').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_16).to().bytes('int16').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_16).to().bytes('uint16').toString()).to.not.throw(Error)

        expect(() => new InvBigInt(MAX_UINT_32).to().bytes('int16').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_32).to().bytes('uint16').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_32).to().bytes('int32').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_32).to().bytes('uint32').toString()).to.not.throw(Error)

        expect(() => new InvBigInt(MAX_UINT_64).to().bytes('int32').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_64).to().bytes('uint32').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_64).to().bytes('int64').toString()).to.throw(Error)
        expect(() => new InvBigInt(MAX_UINT_64).to().bytes('uint64').toString()).to.not.throw(Error)
    

        //MIN INTS
        expect(() => new InvBigInt(MIN_INT_8).to().bytes('int8').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(MIN_INT_8).to().bytes('uint8').toString()).to.throw(Error)

        expect(() => new InvBigInt(MIN_INT_16).to().bytes('int8').toString()).to.throw(Error)
        expect(() => new InvBigInt(MIN_INT_16).to().bytes('int16').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(MIN_INT_16).to().bytes('uint16').toString()).to.throw(Error)

        expect(() => new InvBigInt(MIN_INT_32).to().bytes('int16').toString()).to.throw(Error)
        expect(() => new InvBigInt(MIN_INT_32).to().bytes('int32').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(MIN_INT_32).to().bytes('uint32').toString()).to.throw(Error)

        expect(() => new InvBigInt(MIN_INT_64).to().bytes('int32').toString()).to.throw(Error)
        expect(() => new InvBigInt(MIN_INT_64).to().bytes('int64').toString()).to.not.throw(Error)
        expect(() => new InvBigInt(MIN_INT_64).to().bytes('uint64').toString()).to.throw(Error)
    })

    it('Comparison', () => {
        expect(new InvBigInt(400n).eq(400)).to.eq(true)
        expect(new InvBigInt(400n).eq(400n)).to.eq(true)
        expect(new InvBigInt(400n).eq(new InvBigInt(400))).to.eq(true)

        expect(new InvBigInt(400n).eq(401)).to.eq(false)
        expect(new InvBigInt(400n).eq(401n)).to.eq(false)
        expect(new InvBigInt(400n).eq(new InvBigInt(401))).to.eq(false)

        expect(new InvBigInt(400n).lw(401)).to.eq(true)
        expect(new InvBigInt(400n).lw(401n)).to.eq(true)
        expect(new InvBigInt(400n).lw(new InvBigInt(401))).to.eq(true)

        expect(new InvBigInt(401n).gt(400)).to.eq(true)
        expect(new InvBigInt(401n).gte(400)).to.eq(true)
        expect(new InvBigInt(401n).gte(401)).to.eq(true)
        expect(new InvBigInt(401n).gte(402)).to.eq(false)

        expect(new InvBigInt(401n).lwe(402)).to.eq(true)
        expect(new InvBigInt(401n).lwe(401)).to.eq(true)
        expect(new InvBigInt(401n).lwe(400)).to.eq(false)
    })

    it('Calculate', () => {
        const b = new InvBigInt(1000n)
        expect(b.add(10).big()).to.eq(1010n)
        expect(b.add(100).big()).to.eq(1100n)
        expect(b.sub(100).big()).to.eq(900n)
        expect(b.sub(10).big()).to.eq(990n)
        expect(b.mod(33).big()).to.eq(10n)
        expect(b.mod(300).big()).to.eq(100n)
        expect(b.div(15).big()).to.eq(66n)
        expect(b.div(200).big()).to.eq(5n)
        expect(b.mul(15).big()).to.eq(15_000n)
        expect(b.mul(200).big()).to.eq(200_000n)
        expect(b.addEq(100).big()).to.eq(1100n)
        expect(b.subEq(100).big()).to.eq(1000n)
        expect(b.divEq(10).big()).to.eq(100n)
        expect(b.mulEq(10).big()).to.eq(1000n)

        //float
        expect(b.mulDecimals(0.7)).to.eq('700')
        expect(b.mulDecimals(0.7490245)).to.eq('749.0245')
        expect(new InvBigInt(b.mulDecimals(0.7490245)).big()).to.eq(749n)
        expect(b.divDecimals(0.5)).to.eq('2000')
        expect(b.divDecimals(3.5)).to.eq('285.714285714285714286')
        expect(b.addDecimals(50)).to.eq('1050')
        expect(b.addDecimals(50.51)).to.eq('1050.51')
        expect(b.subDecimals(30.00)).to.eq('970')
        expect(b.subDecimals(30.91)).to.eq('969.09')
    })

    it('Instance', () => {
        expect(InvBigInt.ceil('543.324').big()).to.eq(544n)
        expect(InvBigInt.ceil(543.432).big()).to.eq(544n)
        expect(InvBigInt.ceil('543.000').big()).to.eq(543n)
        expect(InvBigInt.ceil(543.000).big()).to.eq(543n)
        expect(new InvBigInt("0x00324200000000000001").big()).to.eq(927093004891980824577n)


    })



    






})