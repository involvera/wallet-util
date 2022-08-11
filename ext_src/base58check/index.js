'use strict'

var { Sha256 } = require('../hash')
var bs58checkBase = require('./base')

function sha256x2 (buffer) {
    return Sha256(Sha256(buffer))
}

export default bs58checkBase(sha256x2)