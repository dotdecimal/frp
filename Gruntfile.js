module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'src/frp.js',
                ],
                dest: 'dist/frp.js',
            },
        },
        jshint: {
            files: {
                src: ['src/*.js',
                    'test/*.js'
                ],
                globals: {}
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        clean: {
            coverage: {
                src: ['coverage/']
            }
        },
        copy: {
            coverage: {
                src: ['test/**'],
                dest: 'coverage/'
            }
        },
        blanket: {
            coverage: {
                src: ['src/'],
                dest: 'coverage/src/'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                },
                src: ['coverage/test/**/*.js']
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test', // the folder, not the files,
                options: {
                    mask: '*.spec.js'
                }
            },
            coveralls: {
                src: 'test', // the folder, not the files
                options: {
                    coverage: true,
                    root: './src', // define where the cover task should consider the root of libraries that are covered by tests
                    reportFormats: ['lcovonly']
                }
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'coverage/lcov.info',

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: false
            },
            target: {
                src: 'coverage/lcov.info'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-blanket');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-coveralls');

    // Default task(s).
    grunt.registerTask('cover', ['mocha_istanbul:coverage', 'mocha_istanbul:coveralls', 'coveralls', 'coveralls:target']);
    grunt.registerTask('test', ['clean', 'blanket', 'copy', 'mochaTest', 'cover']);
    grunt.registerTask('default', ['concat', 'uglify', 'test']);
};