import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json'

import path from 'path';
const externalId = path.resolve( __dirname, 'ext_src/buffer/def.js' );

const config = {
    input: './index.ts',
    external: [ 'tiny-secp256k1' ],
    output: [
        {
            globals: {
                'tiny-secp256k1': 'ec',
                [externalId]: 'Buffer',
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
        commonjs(),
    ]
}

config.plugins.push(uglify());

export default config