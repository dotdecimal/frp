module.exports = function(grunt) {
    "use strict";

    // Environment variables
    process.env['mocha-json-spec-dest'] = './coverage/result.json';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'lib/frp.js',
                ],
                dest: 'dist/frp.js',
            },
        },
        jsdoc: {
            dist: {
                src: [
                    'README.md',
                    'lib/**/*.js'
                ],
                options: {
                    destination: 'docs',
                    configure: 'jsdoc.conf'
                }
            }
        },
        jshint: {
            files: {
                src: ['lib/*.js'],
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
        mocha_istanbul: {
            test: {
                src: './test',
                options: {
                    mask: '**/*.spec.js',
                    recursive: true,
                    root: './lib',
                    reporter: 'mocha-json-spec-reporter'
                }
            },
            enforce: {
                src: './test',
                options: {
                    mask: '**/*.spec.js',
                    recursive: true,
                    check: {
                        lines: 100,
                        statements: 100,
                        branches: 100,
                        functions: 100
                    },
                    root: './lib',
                    reporter: 'mocha-json-spec-reporter'
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // --------------------------------------------------
    // Testing tasks

    grunt.registerTask('test', function(spec) {
        var key = 'mocha_istanbul.test.options.grep';
        if (typeof spec === 'string') {
            grunt.config.set(key, spec);
        }
        grunt.task.run('mocha_istanbul:test');
    });

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', /*'jshint', 'jsdoc',*/ 'mocha_istanbul:enforce']);
};