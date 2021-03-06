module.exports = {
    dist: {
        files: [{
            dot: true,
            src: [
                '<%= tmpDir %>',
                '<%= distDir %>',
                'docs/<%= distDir %>',
                'docs/ui-guide/<%= distDir %>',
                'templates-cache.generated.js',
                '!<%= distDir %>/.git*'
            ]
        }]
    },
    server: {
        files: '<%= tmpDir %>'
    },
    coverage: {
        files: [{
            dot: true,
            src: ['coverage/']
        }]
    }
};