import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from "rollup-plugin-replace";
import shader from 'rollup-plugin-shader';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const extensions = [
    '.js', '.ts',
];

const name = '@shed/gl';

console.log('running in debug mode:', process.env.DEBUG);

export default {

    input: './src/index.ts',

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: [],

    plugins: [
        replace({
            include: 'src/**',
            __DEBUG__: process.env.DEBUG === 'true'
        }),
        // Allows node_modules resolution
        resolve({ extensions, include: ['src/**/*'] }),

        // Allow bundling cjs modules. Rollup doesn't understand cjs
        // commonjs(
        //     {
        //         namedExports: {
        //             // left-hand side can be an absolute path, a path
        //             // relative to the current directory, or the name
        //             // of a module in node_modules
        //             'node_modules/matter-js/build/matter.js': ['Engine']
        //         }
        //     }

        // ),

        // Compile TypeScript/JavaScript files
        babel({ extensions, include: ['src/**/*'] }),

        shader({
            // All match files will be parsed by default,
            // but you can also specifically include/exclude files
            include: ['**/*.glsl', '**/*.vs', '**/*.fs', '**/*.frag', '**/*.vert'],
            // exclude: ['node_modules/foo/**', 'node_modules/bar/**'],

            // specify whether to remove comments
            removeComments: true,   // default: true
        }),
        // terser()
    ],

    output: [{
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
    }, {
        file: pkg.module,
        format: 'esm',
    }],
};