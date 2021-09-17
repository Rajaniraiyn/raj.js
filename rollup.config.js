import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/raj.ts',
    output: [
        {
            file: 'dist/raj.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/raj.esm.js',
            format: 'es',
            sourcemap: true,
        },
        {
            file: 'dist/raj.umd.js',
            format: 'umd',
            name: 'raj',
            sourcemap: true,
        }
    ],
    plugins: [typescript(), terser()],
}