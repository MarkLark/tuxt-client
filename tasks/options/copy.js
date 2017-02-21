let path = require('path');
let appRoot = path.dirname(path.dirname(__dirname));

module.exports = {
    index: {
        files: [
            {
                cwd: process.cwd(),
                src: path.join(appRoot, 'index.html'),
                dest: '<%= distDir %>/index.html'
            },
            {
                cwd: process.cwd(),
                src: path.join(appRoot, 'index.html'),
                dest: './index.html'
            }
        ]
    },
    config: {
        files: [
            {
                cwd: process.cwd(),
                src: path.join(appRoot, 'scripts', 'config.js'),
                dest: '<%= distDir %>/config.js'
            },
            {
                cwd: process.cwd(),
                src: 'config.js',
                dest: '<%= distDir %>/config.js'
            },
        ]
    },
    assets: {
        files: [
            {
                expand: true,
                dot: true,
                cwd: '<%= coreDir %>',
                dest: '<%= distDir %>',
                src: ['images/**/*', 'scripts/**/*.{json,svg}']
            }
        ]
    }
};