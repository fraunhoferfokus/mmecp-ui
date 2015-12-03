/**
 * Created by bke on 16.03.2015.
 */

module.exports = function(grunt) {

	var js_src = ['app/js/**/*.js', 'app/js/*.js', 'app/modules/**/*.js', 'app/modules/*.js'];
	var css_src = ['app/css/**/*.css', 'app/css/*.css'];
	var js_dest = 'app/dest/js/';
	var css_dest = 'app/dest/css/';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: js_src,
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
				stripBanners: true
			},
			js: {
				src: js_src,
				dest: js_dest + '<%= pkg.name %>.js'
			},
            css: {
                src: css_src,
                dest: css_dest + '<%= pkg.name %>.css'
            }
		},
        bower_concat: {
            all: {
                dest: js_dest + 'dependencies.js',
                cssDest: css_dest + 'dependencies.css'
            }
        },
		uglify: {
			options: {
				banner: '',
				mangle: false
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
                destFile: 'app/index.html',
	            ignorePath: 'app/',
	            relative: true,
	            addRootSlash: false
            },
            prod: {
                src: ['<%= bower_concat.all.dest %>', '<%= bower_concat.all.cssDest %>', '<%= concat.js.dest %>', '<%= concat.css.dest %>']
            },
            dev: {
                src: ['bower.json', '<%= concat.js.src %>', '<%= concat.css.src %>'],

            }

        },
        clean: {
            all: ['<%= concat.js.dest %>', '<%= concat.css.dest %>', '<%= bower_concat.all.dest %>', '<%= bower_concat.all.cssDest %>']
        },
		copy: {
			foundation_icons: {
				expand: true,
				cwd: 'app/bower_components/foundation-icon-fonts/',
				src: ['*.woff', '*.ttf'],
				dest: css_dest
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		},
        removelogging: {
            dist: {
                src:  js_dest + '<%= pkg.name %>.js',
                dest:  js_dest + '<%= pkg.name %>.js'
            }
        },
        bower: {
            install: {
                //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            }
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
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('test', ['jshint','watch']);
	grunt.registerTask('dev', ['jshint','bower:install','injector:dev']);
	grunt.registerTask('prod', ['bower:install','clean', 'concat', 'bower_concat','removelogging', 'uglify', 'cssmin', 'injector:prod', 'copy']);
	grunt.registerTask('default', ['dev']);
};
