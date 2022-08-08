import typescript from 'rollup-plugin-typescript2'
import external from 'rollup-plugin-peer-deps-external'
import { uglify } from 'rollup-plugin-uglify';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';

import pkg from './package.json'

const config = {
    input: './index.ts',
    external: [ 'bip39', 'tiny-secp256k1', 'bip32'],
    output: [
        {
            globals: {
                'bip39': 'bip39',
                'bip32': 'bip32',
                'tiny-secp256k1': 'tiny-secp256k1'
            },
            file: pkg.main,
            format: 'umd',
            name: 'wallet-util'
        },
    ],
    onwarn: function (message) {
        if (/Use of `eval` \(in .*\/src\/sha256\/.*\) is strongly discouraged/.test(message)) {
          return;
        }
    },
    plugins: [
        external(),
        typescript({
            tsconfig: 'tsconfig.json',
            tsconfigOverride: { compilerOptions: { module: 'es2015' } },
        }),
        nodeResolve({
            preferBuiltins: false
        }),
        nodePolyfills(),
        commonjs()
    ]
}

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(uglify());
}

export default config