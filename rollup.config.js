import typescript from 'rollup-plugin-typescript2'
import external from 'rollup-plugin-peer-deps-external'
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

config.plugins.push(uglify());

export default config