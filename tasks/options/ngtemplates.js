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
            'angular.module("tuxt.templates-cache")' +
            '.run([\'$templateCache\', function($templateCache) {' +
            script + ' }]);';
    }
};

module.exports = {
    core: {
        cwd: '<%= coreDir %>',
        dest: path.join(rootDir, 'templates-cache.generated.js'),
        src: src,
        options: options
    },
    dev: {
        cwd: '<%= coreDir %>',
        dest: path.join(rootDir, 'templates-cache.generated.js'),
        src: [],
        options: {bootstrap: () => ''}
    }
};