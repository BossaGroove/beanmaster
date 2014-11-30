'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			app: {
				src: ['app/assets/js/**/*.js', 'app/controllers/**/*.js', 'app/config/**/*.js', 'app/models/**/*.js']
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			}
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			app: {
				files: '<%= jshint.app.src %>',
				tasks: ['jshint:app']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test']
			}
		}
		/*sshconfig: {
			"ssh": grunt.file.readJSON('./key/ssh_key.json')
		},
		shell: {
			dev: {
				options: {
					stderr: true
				},
				command: 'npm start'
			}
		},
		sshexec: {
			deploy: {
				command: 'git pull',
				options: {
					config: 'ssh'
				}
			}
		}*/
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-ssh');
	grunt.loadNpmTasks('grunt-prompt');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-ec2');

	// Default task.
	grunt.registerTask('default', ['jshint']);

	grunt.registerTask('deploy', ['jshint', 'sshexec:deploy']);

};