let path = require('path');

module.exports = function(grunt) {
    let config = {
        pkg: grunt.file.readJSON(path.join(__dirname, 'package.json')),
        appDir: 'app',
        tmpDir: '.tmp',
        distDir: 'dist',
        specDir: 'spec',
        tasksDor: 'tasks',
        bowerDir: 'bower',
        comDir: 'bower_components',
        coreDir: __dirname,
        poDir: 'po',
        livereloadPort: 35729
    };

    grunt.initConfig(config);

    // Auto-load tasks
    require('load-grunt-tasks')(grunt, {
        config: path.join(__dirname, 'package'),
        pattern: [
            'grunt-*',
            '@*/grunt-*'
        ]
    });

    // Auto-load configuration
    require('load-grunt-config')(grunt, {
        config: config,
        configPath: path.join(__dirname, 'tasks', 'options')
    });

    // Linting tasks and alias
    grunt.registerTask('hint', ['eslint']);

    // Test runner tasks and CI
    grunt.registerTask('test', ['ngtemplates:dev', 'karma:unit']);
    grunt.registerTask('ci', ['test', 'hint']);
    grunt.registerTask('ci:travis', ['ngtemplates:dev', 'karma:travis', 'hint']);

    // Development Server
    grunt.registerTask('server', [
        'clean',
        'copy:index',
        'ngtemplates:dev',
        'webpack-dev-server:start'
    ]);

    // Production build
    grunt.registerTask('build', [
        'clean',
        'copy:index',
        'copy:assets',
        'ngtemplates:core',
        'webpack:build',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('package', ['ci', 'build']);
    grunt.registerTask('default', ['server']);
};