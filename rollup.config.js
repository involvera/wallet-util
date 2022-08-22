import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json'


const config = {
    input: './index.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'wallet-util'
        },
    ],
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
            tsconfigOverride: { compilerOptions: { module: 'ES2020' } },
        }),
        commonjs(),
    ]
}

config.plugins.push(uglify());

export default config