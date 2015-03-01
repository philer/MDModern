module.exports = function(grunt) {
  
  "use strict";
  
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
    
    jshint: {
      options: {
        strict: true,    // require all functions (but not global) to be strict mode
        '-W014': true,   // "Bad line break before '+'."
        '-W084': true,   // if (a = b)
        '-W093': true,   // return a = b;
        "-W086": true,   // allow switch-case fall-through
        validthis: true, // $(this) -> "Possible strict mode violation"
        
        globals: {
          jQuery: true,
        },
      },
      all: [
        'Gruntfile.js',
        '<%= jsFiles %>',
        '<%= dirs.js %>/debug.js',
        'console/*.js',
      ],
    },
    
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
    
    removelogging: {
      production: {
        src: [
          // Each file will be overwritten with the assets!
          '<%= dirs.out %>/*.min.js',
        ],
      },
    },
    
    concat: {
      dev: {
        src: [
          '<%= dirs.js %>/debug.js',
          '<%= jsFiles %>',
          'console/console.js',
          'console/mdm-console.js',
        ],
        dest: '<%= dirs.out %>/<%= pkg.name %>.js'
      }
    },
    
    less: {
      dist: {
        options: {
          compress: true,
          banner: '<%= default_banner %>',
          strictMath: true,
        },
        files: {
          '<%= dirs.out %>/<%= pkg.name %>.css': '<%= dirs.less %>/theme.less',
        },
      },
      dev: {
        options: {
          strictMath: true,
        },
        files: {
          '<%= dirs.out %>/<%= pkg.name %>.css': [
            'console/console.css',
            '<%= dirs.less %>/theme.less',
          ],
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
  
  grunt.registerTask('dev',  ['less:dev',  'concat:dev']);
  grunt.registerTask('dist', ['less:dist', 'jshint', 'uglify:dist', 'removelogging']);
  grunt.registerTask('default', 'dev');
};