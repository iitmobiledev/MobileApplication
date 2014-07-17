module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['doc'],
        jsdoc: {
            basic: {
                src: ['js/*.js', 'js/directives/*.js', 'js/controllers/*.js'],
                options: {
                    destination: 'doc'
                }
            },
            //            docstrap: {
            //                src: ['js/**.js'],
            //                options: {
            //                    destination: 'doc/docstrap',
            //                    template: "node_modules/ink-docstrap/template",
            //                    configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
            //                }
            //            }
        },
        jshint: {
            files: ['Gruntfile.js', 'js/**.js', 'js/directives/*.js', 'js/controllers/*.js'],
            options: {
                node: true,
                smarttabs: true
            }
        }

    });

    //    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'jsdoc']);
};