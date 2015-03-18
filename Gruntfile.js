/**
 * Created by bke on 16.03.2015.
 */

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['app/js/**/*.js', 'app/js/*.js'],
            options: {
                node: true,
                browser: true,
                jquery: true,
                loopfunc: true,
                globals: {
                    console: true,
                    module: true,
                    angular: true,
                    streetlife: true
                }
            }
        },
		concat: {
			options: {
				separator: ';'
			},
			js: {
				src: ['app/js/**/*.js', 'app/js/*.js'],
				dest: 'app/js/<%= pkg.name %>.js'
			},
            css: {
                src: ['app/css/**/*.css', 'app/css/*.css'],
                dest: 'app/css/<%= pkg.name %>.css'
            }
		},
        bower_concat: {
            all: {
                dest: 'app/js/dependencies.js',
                cssDest: 'app/css/dependencies.css',
                mainFiles: {
                    'openlayers3': ['app/bower_components/openlayers3/build/ol.js', 'app/bower_components/openlayers3/build/ol.css']
                }
            }
        },
		uglify: {
			options: {
				banner: ''
			},
			all: {
				files: {
					'<%= concat.js.dest %>': ['<%= concat.js.dest %>'],
                    '<%= bower_concat.all.dest %>': ['<%= bower_concat.all.dest %>']
				}
			}
		},
        cssmin: {
            all: {
                files: {
                    '<%= concat.css.dest %>': ['<%= concat.css.dest %>'],
                    '<%= bower_concat.all.cssDest %>': ['<%= bower_concat.all.cssDest %>']
                }
            }
        },
        injector: {
            options: {
                destFile: 'app/index.html'
            },
            prod: {
                src: ['<%= bower_concat.all.dest %>', '<%= bower_concat.all.cssDest %>', '<%= concat.js.dest %>', '<%= concat.css.dest %>']
            },
            dev: {
                src: ['bower.json', 'app/js/**/*.js', 'app/js/*.js', 'app/css/**/*.css', 'app/css/*.css']
            }
        },
        clean: {
            js: ['<%= concat.js.dest %>', '<%= concat.css.dest %>', '<%= bower_concat.all.dest %>', '<%= bower_concat.all.cssDest %>']
        },
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['jshint', 'watch']);
	grunt.registerTask('dev', ['jshint', 'injector:dev']);
	grunt.registerTask('prod', ['clean', 'concat', 'bower_concat', 'uglify', 'cssmin', 'injector:prod']);
	grunt.registerTask('default', ['dev']);
};
