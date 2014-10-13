module.exports = function(grunt) {
  
  require('load-grunt-tasks')(grunt);
  
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    
    default_banner:'/*! <%= pkg.name %> by <%= pkg.author.name %> */\n',
    
    dirs: {
      js:   'js',
      less: 'less',
      out:  'min'
    },
    
    jsFiles: [
      // core modules
      '<%= dirs.js %>/mdm.js',
      '<%= dirs.js %>/config.js',
      
      // theme base
      '<%= dirs.js %>/theme.js',
      
      // optional modules
      '<%= dirs.js %>/session.js',
      '<%= dirs.js %>/language.js',
      '<%= dirs.js %>/slideshow.js',
      '<%= dirs.js %>/lsb_release.js',
    ],
    
    uglify: {
      dist: {
        options: {
          banner: '<%= default_banner %>var debug=false;'
        },
        files: {
          '<%= dirs.out %>/<%= pkg.name %>.js': '<%= jsFiles %>'
        }
      }
    },
    
    concat: {
      dev: {
        src: ['<%= dirs.js %>/debug.js', '<%= jsFiles %>'],
        dest: '<%= dirs.out %>/<%= pkg.name %>.js'
      }
    },
    
    less: {
      dist: {
        options: {
          compress: true,
          banner: '<%= default_banner %>'
        },
        files: {
          '<%= dirs.out %>/<%= pkg.name %>.css': '<%= dirs.less %>/theme.less'
        }
      },
      dev: {
        files: {
          '<%= dirs.out %>/<%= pkg.name %>.css': '<%= dirs.less %>/theme.less'
        }
      }
    },
    
    watch: {
      stylesheets: {
        files: '<%= dirs.less %>/**/*.less',
        tasks: ['less:dev']
      },
      scripts: {
        files: '<%= dirs.js %>/**/*.js',
        tasks: ['concat:dev']
      }
    }
    
  });
  
  grunt.registerTask('default', ['less:dev',  'concat:dev']);
  grunt.registerTask('dist',    ['less:dist', 'uglify:dist']);
};