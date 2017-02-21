module.exports = {
    options: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false,
        reporters: ['dots']
    },
    single: {
        reporters: 'dots'
    },
    watch: {
        singleRun: false,
        autoWatch: true,
        reporters: 'dots'
    },
    unit: {
        coverageReporter: {
            reporters:[
                {type: 'html', dir: 'coverage/', subdir: 'html'},
                {type: 'json', dir: 'coverage/', subdir: 'json', file: 'coverage.json'},
                {type: 'json-summary', dir: 'coverage/', subdir: 'json', file: 'coverage-summary.json'},
                {type: 'lcovonly', dir: 'coverage/', subdir: 'lcov' }
            ]
        },
        reporters: ['dots', 'coverage']
    },
    travis: {
        reporters: ['dots']
    }
};