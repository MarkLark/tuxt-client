let path = require('path');
let webpack = require('webpack');

module.exports = function makeConfig(grunt) {
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
            })
        ],

        resolve: {
            root: [
                __dirname,
                path.join(__dirname, '/scripts'),
                path.join(__dirname, '/styles/sass')
            ],
            extensions: ['', '.js', '.jsx']
        },

        eslint: {
            configFile: null,
            ignorePath: null
        },

        module: {
            preloaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'eslint-loader',
                    exclude: (p) => p.indexOf('node_modules') !== -1
                }
            ],

            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: (p) => p.indexOf('node_modules') !== -1,
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
