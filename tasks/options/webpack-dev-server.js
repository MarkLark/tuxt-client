let makeConfig = require('../../webpack.config.js');

module.exports = function(grunt) {
    let webpackConfig = makeConfig(grunt);

    return {
        options: {
            webpack: webpackConfig,
            publicPath: '/dist',
            port: 9000,
            host: '0.0.0.0',
            headers: {
                'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
            }
        },

        start: {
            keepAlive: true,
            proxy: getProxy(),
            webpack: {
                devtool: 'eval',
                debug: true,
                entry: {
                    app: ['webpack-dev-server/client?http://localhost:9000/'].concat(webpackConfig.entry.app)
                },
                output: {
                    publicPath: 'dist'
                }
            }
        }
    };
};

// getProxy returns the proxy configuration for the dev server. In the dev
// environment, some paths need to be rewritten.
function getProxy() {
    // prepend returns a proxy configuration that prepends the passed URL with
    // the given parameter.
    let prepend = function(loc) {
        return {
            target: 'http://localhost:9000',
            rewrite: function(req) {
                req.url = loc + req.url;
            }
        };
    };

    return {
        '/app.bundle.js': prepend('dist')
    };
}