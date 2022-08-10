const test = require('tape')
const b64 = require('../../src/base64')

test('convert big data to base64', function (t) {
  const big = new Uint8Array(64 * 1024 * 1024)
  for (let i = 0, length = big.length; i < length; ++i) {
    big[i] = i % 256
  }
  const b64str = b64.fromByteArray(big)
  const arr = b64.toByteArray(b64str)
  t.ok(equal(arr, big))
  t.equal(b64.byteLength(b64str), arr.length)
  t.end()
})

function equal (a, b) {
  let i
  const length = a.length
  if (length !== b.length) return false
  for (i = 0; i < length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}