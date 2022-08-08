/*
 * $Id: es5.js,v 0.1 2012/08/23 19:43:17 dankogai Exp dankogai $
 *
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
var assert = assert || require("assert");
var Base64 = Base64 || require('../../src/base64').Base64;
var is = function (a, e, m) {
    return function () {
        assert.equal(a, e, m)
    }
};

if (typeof Base64.extendString == 'function'){
    delete String.prototype.fromBase64;
    delete String.prototype.toBase64;
    delete String.prototype.toBase64URI;
    delete String.prototype.toBase64URL;
    delete String.prototype.toUint8Array;
    Base64.extendString();
    describe('ES5 String', function () {
        it('.toBase64', is('小飼弾'.toBase64(), '5bCP6aO85by+'));
        it('.toBase64', is('小飼弾'.toBase64(true), '5bCP6aO85by-'));
        it('.toBase64URI', is('小飼弾'.toBase64URI(), '5bCP6aO85by-'));
        it('.fromBase64', is('5bCP6aO85by+'.fromBase64(), '小飼弾'));
        it('.fromBase64', is('5bCP6aO85by-'.fromBase64(), '小飼弾'));
    });
}
