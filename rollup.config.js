import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import pkg from './package.json'

const config = {
    input: './index.ts',
    external: [ 'tiny-secp256k1'],
    output: [
        {
            globals: {
                'tiny-secp256k1': 'ec'
            },
            file: pkg.main,
            format: 'umd',
            name: 'wallet-util'
        },
    ],
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
            tsconfigOverride: { compilerOptions: { module: 'ES2015' } },
        }),
        nodeResolve({
            preferBuiltins: false
        }),
        nodePolyfills(),
        commonjs(),
    ]
}

config.plugins.push(uglify());

export default config