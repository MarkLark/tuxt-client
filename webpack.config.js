let path = require('path');
let webpack = require('webpack');
let lodash = require('lodash');

module.exports = function makeConfig(grunt) {
    let appConfigPath = path.join(process.cwd(), 'tuxt.config.js');

    if (process.env.TUXT_CONFIG) {
        appConfigPath = path.join(process.cwd(), process.env.TUXT_CONFIG);
    }
    if (grunt.option('config')) {
        appConfigPath = path.join(process.cwd(), grunt.option('config'));
    }

    const tuxConfig = lodash.defaultsDeep(require(appConfigPath)(grunt), getDefaults(grunt));

    // shouldExclude return true if the path p should be excluded from loaders
    // such as 'babel' or 'eslint'. This is to avoid including node_modules into
    // these loaders, but not node modules that are tuxt apps.
    const shouldExclude = function(p) {
        // Don't exclude anything outside node_modules
        if (p.indexOf('node_modules') === -1 ) {
            return false;
        }
        // Include only 'tuxt-core' and valid modules inside node_modules
        let validModules = ['tuxt-core'].concat(tuxConfig.apps);
        return !validModules.some(app => p.indexOf(app) > -1 );
    };

    const isEmbedded = require('fs').existsSync('./node_modules/tuxt-core');

    return {
        cache: true,

        entry: {
            app: ['scripts/index.js']
        },

        output: {
            path: path.join(process.cwd(), 'dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].bundle.js'
        },

        plugins: [
            new webpack.ProvidePlugin({
                '$': 'jquery',
                'window.$': 'jquery',
                'jQuery': 'jquery',
                'window.jQuery': 'jquery',
            }),
            new webpack.DefinePlugin({
                __TUXT_CONFIG__: JSON.stringify(tuxConfig)
            })
        ],

        resolve: {
            root: [
                __dirname,
                path.join(__dirname, '/scripts'),
                path.join(__dirname, '/styles/sass')
            ],
            alias: {
                'external-apps': path.join(process.cwd(), 'dist', 'app-importer.generated.js')
            },
            extensions: ['', '.js', '.jsx']
        },

        eslint: {
            configFile: isEmbedded ? './node_modules/tuxt-core/.eslintrc.json': null,
            ignorePath: isEmbedded ? './node_modules/tuxt-core/.eslintignore': null
        },

        module: {
            preloaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'eslint-loader',
                    // tuxt apps handle their own linter
                    exclude: (p) => p.indexOf('node_modules') !== -1 || (tuxConfig.apps && tuxConfig.apps.some(app => p.indexOf(app) > -1)),
                }
            ],

            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: shouldExclude,
                    loader: 'babel',
                    query: {
                        cacheDirectory: true,
                        presets: ['es2015'],
                        plugins: ['transform-object-rest-spread']
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'html'
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.css/,
                    loader: 'style!css'
                },
                {
                    test: /\.less$/,
                    loader: 'style!css!less'
                },
                {
                    test: /\.scss$/,
                    loader: 'style!css!sass'
                },
                {
                    test: /\.(png|gif|jpeg|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                    loader: 'file-loader'
                },
                {
                    test: /bootstrap\/dist\/js\/umd\//,
                    loader: 'imports?jQuery=jquery'
                }
            ]
        }
    }
};

function getDefaults(grunt) {
    return {
        version: grunt.file.readJSON(path.join(__dirname, 'package.json')).version,

        server: {
            url: grunt.option('server') || process.env.TUXT_URL || 'http://localhost:5000/api'
        },

        defaultTimezone: grunt.option('defaultTimezone') || 'Australia/Sydney',

        model: {
            dateformat: 'DD/MM/YYYY',
            timeformat: 'HH:mm:ss'
        },

        view: {
            dateformat: process.env.VIEW_DATE_FORMAT || 'DD/MM/YYYY',
            timeformat: process.env.VIEW_TIME_FORMAT || 'HH:mm'
        },

        defaultRoute: '/'
    }
};