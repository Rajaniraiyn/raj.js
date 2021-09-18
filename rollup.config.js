import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";

const terserOptions = {
    module: false,
    compress: {
        drop_console: true,
        ecma: 6,
        keep_classnames: /Raj/,
        unsafe_math: true,
        unsafe_methods: true,
    },
    mangle: {
        keep_classnames: /Raj/,
    },
    format: {
        comments: /\*!$/gm
    }
}

export default {
    input: 'src/raj.ts',
    output: [
        {
            file: 'dist/raj.js',
            format: 'es',
            sourcemap: true,
        },
        {
            file: 'dist/raj.min.js',
            format: 'es',
            sourcemap: true,
            plugins: [terser(terserOptions)],
        },
    ],
    plugins: [typescript()],
}