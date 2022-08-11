


import 'mocha';
import { expect } from 'chai';

var xorshift = require('../../src/xorshift')
var reference = require('./fixtures.json');
import { RandomBytes } from '../../src/bytes'


function hexview(arr: any) {
  var a = arr[0].toString(16);
  var b = arr[1].toString(16);

  a = ((new Array(9 - a.length)) as any).join(0) + a;
  b = ((new Array(9 - b.length)) as any).join(0) + b;

  return (a + b).toUpperCase();
}

function floatview(d: any) {
  // Makes sure that the exponent has two digets like in C-printf
  var s = d.toExponential(20);
  var m = s.match(/^([0-9.]+)e(\+|-)([0-9]+)$/);
  var e = (m[3].length === 1) ? '0' + m[3] : m[3];
  return m[1] + 'e' + m[2] + e;
}

 it('with seed = [1, 2]', () => {
    var ref = reference.double['1-2'];
    var rng = xorshift.constructor([0, 1, 0, 2]);
    for (var i = 0; i < ref.length; i++) {
        expect(floatview(rng.random())).eq(ref[i])
    }
  });

  it('with seed = [3, 4]', () => {
    var ref = reference.double['3-4'];
    var rng = xorshift.constructor([0, 3, 0, 4]);
    for (var i = 0; i < ref.length; i++) {
        expect(floatview(rng.random()), ref[i])
    }
  });

  it('with seed = [1, 2]', () => {
    var ref = reference.integer['1-2'];
    var rng = xorshift.constructor([0, 1, 0, 2]);
    for (var i = 0; i < ref.length; i++) {
      expect(hexview(rng.randomint())).to.eq(ref[i])
    }
  });

  it('with seed = [3, 4]', () => {
    var ref = reference.integer['3-4'];
    var rng = xorshift.constructor([0, 3, 0, 4]);
    for (var i = 0; i < ref.length; i++) {
      expect(hexview(rng.randomint())).to.eq(ref[i])
    }
  });

  it('random int', () => {
    // demand that the 100 first outputs are different
    var obj = Object.create(null);
    for (var i = 0; i< 100; i++) {
      obj[hexview(xorshift.randomint())] = 1;
    }
    expect(Object.keys(obj).length).to.eq(100)
  });

  it('random double', () => {
    // demand that the 100 first outputs are different
    var obj = Object.create(null);
    for (var i = 0; i< 100; i++) {
      var rand = xorshift.random();
      obj[rand.toExponential(20)] = 1;
      expect(rand >= 0 && rand < 1).to.eq(true)
    }
    expect(Object.keys(obj).length).to.eq(100)
  });

  it('wrong input type', () => {
    var error: any = null;
    try {
      xorshift.constructor("0102");
    } catch (e) { error = e; }

    expect(error.name).to.eq('TypeError')
    expect(error.message).to.eq('seed must be an array with 4 numbers')    
  });

  it('wrong array length', () => {
    var error: any = null;
    try {
      xorshift.constructor([1, 2, 0]);
    } catch (e) { error = e; }

    expect(error.name).to.eq('TypeError')
    expect(error.message).to.eq('seed must be an array with 4 numbers')
  });

it('constructor export', () => {
    expect(xorshift.constructor).to.eq(xorshift.XorShift);
});

it('yes', () =>{
  console.log(RandomBytes(16))
})