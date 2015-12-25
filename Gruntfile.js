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
      
      // theme modules
      '<%= dirs.js %>/buttons.js',
      '<%= dirs.js %>/messages.js',
      '<%= dirs.js %>/countdown.js',
      '<%= dirs.js %>/login.js',
      '<%= dirs.js %>/session.js',
      '<%= dirs.js %>/language.js',
      '<%= dirs.js %>/slideshow.js',
      
      // use this if you need info from /etc/lsb-release
      // other than DISTRIB_DESCRIPTION
      // '<%= dirs.js %>/lsb_release.js',
    ],
    
    jshint: {
      options: {
        strict: true,    // require all functions (but not global) to be strict mode
        laxcomma: true,  // comma-first object definitions
        '-W014': true,   // "Bad line break before '+'."
        '-W084': true,   // if (a = b)
        '-W093': true,   // return a = b;
        // "-W086": true,   // allow switch-case fall-through
        validthis: true, // $(this) -> "Possible strict mode violation"
        
        globals: {
          jQuery: true,
        },
      },
      all: [
        'Gruntfile.js',
        '<%= jsFiles %>',
        'console/*.js',
      ],
    },
    
    concat: {
      dev: {
        src: [
          'console/console.js',
          '<%= jsFiles %>',
          'console/mdm-console.js',
        ],
        dest: '<%= dirs.out %>/<%= pkg.name %>.js'
      },
      dist: {
        src: '<%= jsFiles %>',
        dest: '<%= dirs.out %>/<%= pkg.name %>.js'
      }
    },
    
    removelogging: {
      dist: {
        options: {
          namespace: [
            'console', 'HtmlConsole', 'cnsl',
          ],
          methods: [
            'log', 'warn', 'error', 'info', 'exec', 'formatString',
          ],
        },
        src: [
          // Each file will be overwritten with the assets!
          '<%= dirs.out %>/*.js',
        ],
      },
    },
    
    uglify: {
      dist: {
        options: {
          banner: '<%= default_banner %>',
          screwIE8: true,
        },
        files: {
          // '<%= dirs.out %>/<%= pkg.name %>.js': '<%= jsFiles %>'
          '<%= dirs.out %>/<%= pkg.name %>.js': '<%= dirs.out %>/<%= pkg.name %>.js' // replace
        }
      }
    },
    
    less: {
      dist: {
        options: {
          compress: true,
          cleancss: true,
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
        files: ['<%= dirs.less %>/**/*.less', 'console/**/*.css'],
        tasks: ['less:dev']
      },
      scripts: {
        files: ['<%= dirs.js %>/**/*.js', 'console/*.js'],
        tasks: ['concat:dev']
      }
    }
    
  });
  
  grunt.registerTask('dev',  ['less:dev', 'concat:dev']);
  grunt.registerTask('dist', [
    'less:dist',
    'jshint',
    'concat:dist',
    'removelogging',
    'uglify:dist',
  ]);
  grunt.registerTask('default', 'dev');
};
