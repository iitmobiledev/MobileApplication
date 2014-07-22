module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['docs'],
        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false
            },
            api: {
                src: ['js/*.js', 'js/directives/*.js', 'js/controllers/*.js'],
                title: 'API Documentation'
            }
        },

        html2js: {
            main: {
                options: {
                    base: 'src'
                },
                src: ['date-navigation.html'],
                dest: 'tpl/templates.js'
            }
        }

//        html2js: {
//            options: {
//                base: 'src'
//                // custom options, see below
//            },
//            main: {
//                src: ['date-navigation.html'],
//                dest: 'tpl/templates.js'
//            }
//        }

    });

    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('default', ['ngdocs']);
};