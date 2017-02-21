let webpack = require('webpack');

module.exports = function(grunt) {
    let config = require('../../webpack.config.js')(grunt);

    return {
        options: config,
        build: {
            plugins: config.plugins.concat(
                new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
                new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
            )
        }
    };
};