import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json'


const config = {
    input: './index.ts',
    onwarn: function ( warning, next ) {
        if ( warning.code === 'UNRESOLVED_IMPORT' ) return;
        if ( warning.code === 'CIRCULAR_DEPENDENCY' ) return;
        if ( warning.code === 'MISSING_GLOBAL_NAME' ) return;
        next( warning );
    },
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