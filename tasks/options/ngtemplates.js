let path = require('path');
let rootDir = path.dirname(path.dirname(__dirname));

let src = [
    'scripts/**/*.html',
    'scripts/**/*.svg'
];

let options = {
    htmlmin: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true
    },
    bootstrap: function(module, script) {
        return '"use strict";' +
            'angular.module("dstore.templates-cache")' +
            '.run([\'$templateCache\', function($templateCache) {' +
            script + ' }]);';
    }
};

// get the superdesk.config.js configuration object
function getConfig() {
    return require(path.join(process.cwd(), 'dstore.config.js'))();
}

module.exports = {
    core: {
        cwd: '<%= coreDir %>',
        dest: path.join(rootDir, 'templates-cache.generated.js'),
        src: src,
        options: options
    },

    'ui-guide': {
        cwd: '<%= coreDir %>',
        dest: 'docs/ui-guide/dist/templates-cache-docs.generated.js',
        src: src,
        options: options
    },

    dev: {
        cwd: '<%= coreDir %>',
        dest: path.join(rootDir, 'templates-cache.generated.js'),
        src: [],
        options: {bootstrap: () => ''}
    },

    // gen-apps generates a file that imports all of the external node
    // modules defined in dstore.config.js and returns an array of their
    // exports.
    'gen-apps': {
        cwd: '<%= coreDir %>',
        dest: 'dist/app-importer.generated.js',
        src: __filename, // hack to make ngtemplate work
        options: {
            bootstrap: function() {
                // get apps defined in config
                let paths = getConfig().apps || [];

                if (!paths.length) {
                    return 'export default [];\r\n';
                }

                let abs = (p) => path.join(process.cwd(), 'node_modules', p);
                let data = 'export default [\r\n\trequire("' + abs(paths[0]) + '").default.name';

                for (let i = 1; i < paths.length; i++) {
                    data += ',\r\n\trequire("' + abs(paths[i]) + '").default.name';
                }

                return data + '\r\n];\r\n';
            }
        }
    }
};