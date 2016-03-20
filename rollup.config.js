import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

var babelOptions = {
  presets: ["es2015-rollup", "stage-2"],
  exclude: 'node_modules/**',
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
  ],
  intro: "var undefined;",
  globals: {jQuery:'jQuery',window:'window',document:'document',body:'document.body',console:'console'},
  external: ['jQuery', 'window', 'document', 'body', 'console'],
};
