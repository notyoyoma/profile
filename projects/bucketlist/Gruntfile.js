module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'style.css': 'main.scss'
        }
      }
    },
    watch: {
      src: {
        files: [ "main.scss", "css/**/*.scss", "node_modules/**/*.scss" ],
        tasks: [ 'css' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('css', ['sass']);
  grunt.registerTask('default', ['watch']);

};
