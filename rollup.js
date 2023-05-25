/* eslint-env node */
const fs = require('fs');
const uglifyJs = require('uglify-js');
const chalk = require('chalk');
const maxmin = require('maxmin');

const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const pkg = require('./package.json');

const name = `${pkg.name} v${pkg.version}`;
const copyright = `(c) ${new Date().getFullYear()} Vimeo`;
const url = `https://github.com/${pkg.repository}`;
const banner = `/*! ${name} | ${copyright} | ${pkg.license} License | ${url} */`;

const watch = process.argv.indexOf('--watch') !== -1;

let cache = null;
let building = false;
let needsRebuild = false;

async function generateBundle() {
    if (building) {
        needsRebuild = true;
        return;
    }

    building = true;
    needsRebuild = false;

    if (watch) {
        console.log(new Date().toString());
    }

    try {
        const bundle = await rollup.rollup({
            cache,
            input: 'src/player.js',
            plugins: [
                babel(),
                commonjs(),
                nodeResolve()
            ]
        });

        cache = bundle;

        let { output } = await bundle.generate({
            format: 'umd',
            name: 'Vimeo.Player',
            sourcemap: true,
            sourcemapFile: 'dist/player.js.map',
            banner
        });

        let { code, map } = output[0];

        fs.writeFileSync('dist/player.js', `${code}\n//# sourceMappingURL=player.js.map`);
        fs.writeFileSync('dist/player.js.map', map.toString());

        const size = maxmin(code, code, true).replace(/^(.*? → )/, '');
        console.log(`Created bundle ${chalk.cyan('player.js')}: ${size}`);

        const minified = uglifyJs.minify(code, {
            sourceMap: {
                content: map,
                url: 'dist/player.min.js.map'
            },
            output: {
                preamble: banner
            },
            mangle: {
                reserved: ['Player']
            }
        });

        fs.writeFileSync('dist/player.min.js', minified.code.replace(/\/\/# sourceMappingURL=\S+/, ''));
        fs.writeFileSync('dist/player.min.js.map', minified.map);

        const minifiedSize = maxmin(code, minified.code, true);
        console.log(`Created bundle ${chalk.cyan('player.min.js')}: ${minifiedSize}`);

        ({ output } = await bundle.generate({
            format: 'es',
            banner
        }));

        ({ code, map } = output[0]);

        fs.writeFileSync('dist/player.es.js', code);
        const esSize = maxmin(code, code, true).replace(/^(.*? → )/, '');
        console.log(`Created bundle ${chalk.cyan('player.es.js')}: ${esSize}`);

        building = false;

        if (needsRebuild) {
            await generateBundle();
        }

    } catch(error) {
        console.log(error);
    };
};

generateBundle();

if (watch) {
    const chokidar = require('chokidar');
    const watcher = chokidar.watch('src/**/*');
    watcher.on('change', generateBundle);
}
