import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from "rollup-plugin-replace";
import shader from 'rollup-plugin-shader';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy-glob';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload'
import pkg from './package.json';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];
const name = '@shed/gl';

console.log('running in debug mode:', process.env.DEBUG);

export default [
    buildExample('image_processing'),
    buildExample('index'),
    // initExample('lookAtTrangles') // TODO
    buildExample('multiTexture'),
    buildExample('trangle'),
    buildExample('transform'),
    buildExample('shape'), 
    initExample('helloWorld')
]

/**
    buildExample, copy all assets, open browser
*/
function initExample(name) {
    let obj = buildExample(name);
    obj.plugins.push(
        copy([
            { files: 'src/examples/webgl-debug.js', dest: 'examples' },
            { files: 'src/examples/*.+(jpg|gif|png)', dest: 'examples' },
        ], { verbose: true }),
        serve({
            open: true,
            openPage: `/${name}.html`,
            contentBase: 'examples'
        }),
        livereload({ watch: 'examples' })
    )
    return obj;
}

function buildExample(name = 'index') {
    return {
        input: `./src/examples/${name}.ts`,
        output: {
            file: `./examples/${name}.js`,
            format: 'cjs',
            sourcemap: true
        },
        plugins: [
            replace({
                include: 'src/**',
                __DEBUG__: process.env.DEBUG === 'true'
            }),
            htmlTemplate({
                template: 'src/examples/template.html',
                target: `${name}.html`
            }),
            // Allows node_modules resolution
            resolve({ extensions }),
            // Allow bundling cjs modules. Rollup doesn't understand cjs

            commonjs(
                {
                    namedExports: {
                        // left-hand side can be an absolute path, a path
                        // relative to the current directory, or the name
                        // of a module in node_modules
                        'node_modules/matter-js/build/matter.js': ['Engine','Bodies','Render','World']
                    }
                }

            ),
            // Compile TypeScript/JavaScript files
            babel({ extensions, include: ['src/**/*'] }),
            shader({
                // All match files will be parsed by default,
                // but you can also specifically include/exclude files
                include: ['**/*.glsl', '**/*.vs', '**/*.fs', '**/*.frag', '**/*.vert'],
                // exclude: ['node_modules/foo/**', 'node_modules/bar/**'],

                // specify whether to remove comments
                removeComments: true,   // default: true
            })
        ]
    }
}



