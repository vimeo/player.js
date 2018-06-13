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

const generateBundle = () => {
    if (building) {
        needsRebuild = true;
        return;
    }

    building = true;
    needsRebuild = false;

    if (watch) {
        console.log(new Date().toString());
    }

    rollup.rollup({
        cache,
        entry: 'src/player.js',
        plugins: [
            babel(),
            commonjs(),
            nodeResolve({
                jsnext: true
            })
        ]
    })
    .then((bundle) => {
        cache = bundle;

        const { code, map } = bundle.generate({
            format: 'umd',
            moduleName: 'Vimeo.Player',
            sourceMap: true,
            sourceMapFile: 'dist/player.js.map',
            banner
        });

        fs.writeFileSync('dist/player.js', `${code}\n//# sourceMappingURL=player.js.map`);
        fs.writeFileSync('dist/player.js.map', map.toString());

        const size = maxmin(code, code, true).replace(/^(.*? → )/, '');
        console.log(`Created bundle ${chalk.cyan('player.js')}: ${size}`);

        const minified = uglifyJs.minify(code, {
            fromString: true,
            inSourceMap: map,
            outSourceMap: 'dist/player.min.js.map',
            output: {
                preamble: banner
            },
            mangle: {
                except: ['Player']
            }
        });

        fs.writeFileSync('dist/player.min.js', minified.code.replace(/\/\/# sourceMappingURL=\S+/, ''));
        fs.writeFileSync('dist/player.min.js.map', minified.map);

        const minifiedSize = maxmin(code, minified.code, true);
        console.log(`Created bundle ${chalk.cyan('player.min.js')}: ${minifiedSize}`);

        const es = bundle.generate({
            format: 'es',
            banner
        });

        fs.writeFileSync('dist/player.es.js', es.code);
        const esSize = maxmin(es.code, es.code, true).replace(/^(.*? → )/, '');
        console.log(`Created bundle ${chalk.cyan('player.es.js')}: ${esSize}`);

        const cjs = bundle.generate({
            format: 'cjs',
            banner
        });

        fs.writeFileSync('dist/player.cjs.js', cjs.code);
        const cjsSize = maxmin(cjs.code, cjs.code, true).replace(/^(.*? → )/, '');
        console.log(`Created bundle ${chalk.cyan('player.cjs.js')}: ${cjsSize}`);

        return minified;
    })
    .then(() => {
        building = false;

        if (needsRebuild) {
            generateBundle();
        }

        return true;
    })
    .catch((error) => {
        console.log(error);
    });
};

generateBundle();

if (watch) {
    const chokidar = require('chokidar');
    const watcher = chokidar.watch('src/**/*');
    watcher.on('change', generateBundle);
}
