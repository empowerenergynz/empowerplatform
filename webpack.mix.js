const mix = require('laravel-mix');
const path = require('path');

/*
 |--------------------------------------------------------------------------
 | Mix Empower Energy
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts('resources/ts/app.tsx', 'public/js')
    .webpackConfig({
        resolve: {
            alias: {
                'src': path.resolve(__dirname, 'resources/ts'),
            },
        },
    })
    .copyDirectory('resources/fonts', 'public/fonts')
    .copyDirectory('resources/images', 'public/images');

if (process.env.APP_ENV !== 'local') {
    mix.version();
}

if (process.env.APP_ENV !== 'production') {
    mix.sourceMaps(true);
}
