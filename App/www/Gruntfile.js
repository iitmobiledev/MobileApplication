module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['doc'],
        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false
            },
            api: {
                src: ['js/*.js', 'js/directives/*.js', 'js/controllers/*.js'],
                title: 'API Documentation'
            }
        }

    });
    
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'ngdocs']);
};