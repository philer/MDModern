import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

var babelOptions = {
  "presets": ["es2015-rollup"],
};

export default {
  moduleName: 'MDModern',
  entry:      'js/index.js',
  dest:       'dist/MDModern.js',
  sourceMap:  true,
  format:     'iife',
  plugins:    [
    json(),
    babel(babelOptions),
    uglify(),
  ],
  intro: "var undefined;",
  globals: {
    jQuery: 'jQuery',
    window: 'window',
    document: 'document',
    body: 'document.body',
    console: 'console',
    // undefined: 'void 0',
  },
  external: ['jQuery', 'window', 'document', 'body', 'console'],
};
