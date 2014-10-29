/*global grunt */
module.exports = function(grunt) {
  grunt.initConfig({
    mochacov: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      },
      cov: {
        options: {
          reporter: 'html-cov'
        },
        src: ['test/*.js']
      },
      options: {
        require: ['should']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cov');

  grunt.registerTask('test', ['mochacov:test']);
  grunt.registerTask('cov', ['mochacov:cov']);
};
