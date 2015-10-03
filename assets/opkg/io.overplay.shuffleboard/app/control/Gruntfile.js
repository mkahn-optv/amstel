module.exports = function (grunt) {

    console.log("Grunting...");
    // Project configuration.
    grunt.initConfig({
                         pkg: grunt.file.readJSON('package.json'),
                         concat_css: {
                             options: {
                                 // Task-specific options go here.
                             },
                             all: {
                                 src: ["app/**/*.css"],
                                 dest: "assets/css/compiled-styles.css"
                             }
                         },
                         watch: {
                             stylesheets: {
                                 files: ['app/**/*.css'],
                                 tasks: ['concat_css']

                             }
                         }
                     });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['concat_css']);
    grunt.registerTask('watch_css', ['watch:stylesheets']);
    //grunt.registerTask('obfus', ['clean', 'uglify']);

};