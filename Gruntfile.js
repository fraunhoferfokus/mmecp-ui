/**
 * Created by bke on 16.03.2015.
 */

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			js: {
				src: ['src/**/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			},
            css: {
                src: ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
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
        injector: {
            options: {
                destFile: 'app/index.html'
            },
            dev: {
                src: ['bower.json', 'app/js/*.js', 'app/css/*.css']
            },
            prod: {
                src: ['bower.json', 'app/js/*.js', 'app/js/**/*.js', 'app/css/*.css', 'app/css/**/*.css']
            }
        },
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'qunit']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-injector');
	/*
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	*/

    grunt.registerTask('blubb', ['injector:prod']);
	grunt.registerTask('dev', ['jshint', 'injector:dev']);
	grunt.registerTask('prod', ['test', 'concat', 'uglify']);
	grunt.registerTask('default', ['dev']);
};
