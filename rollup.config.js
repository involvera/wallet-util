import typescript from 'rollup-plugin-typescript2'
import external from 'rollup-plugin-peer-deps-external'
import { uglify } from 'rollup-plugin-uglify';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json'

const config = {
    input: './index.ts',
    external: [ 'create-hash','bip39', 'base-x', 'elliptic', 'bip32'],
    output: [
        {
            globals: {
                'create-hash': 'create-hash',
                'bip39': 'bip39',
                'base-x': 'base-x',
                'elliptic': 'elliptic',
                'bip32': 'bip32',
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
        nodeResolve()
    ]
}

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(uglify());
}

export default config