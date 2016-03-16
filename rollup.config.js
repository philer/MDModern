import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';


var lintOptions = {
  parser: "babel-eslint",
  // throwError: true,
  include: "MDM/**",
  rules: {
    "strict": 1,
  },
};

var babelOptions = {
  "presets": ["es2015-rollup"],
};

export default {
  moduleName: 'MDModern',
  entry:      'js/index.js',
  dest:       'min/MDModern.min.js',
  sourceMap:  true,
  format:     'iife',
  plugins:    [
    json(),
    eslint(lintOptions),
    babel(babelOptions),
    // uglify(),
  ],
  globals: {
    jQuery: 'jQuery',
    window: 'window',
    document: 'document',
    body: 'document.body',
    console: 'console',
    // undefined: 'void 0',
  },
};
