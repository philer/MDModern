// import replace from 'rollup-plugin-replace';
import multiEntry from 'rollup-plugin-multi-entry';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const babelOptions = {
  presets: ["es2015-rollup", "stage-2"],
  exclude: 'node_modules/**',
};

const config = {
  moduleName: 'MDModern',
  entry:      'js/index.js',
  dest:       'dist/MDModern.js',
  sourceMap:  true,
  format:     'iife',
  plugins:    [
    // replace({ DEBUG: JSON.stringify(!production) }),
    json(),
    babel(babelOptions),
  ],
  intro: "var undefined;",
  globals: {jQuery:'jQuery',window:'window',document:'document',body:'document.body',console:'console'},
  external: ['jQuery', 'window', 'document', 'body', 'console'],
};


const DEBUG = process.env.NODE_ENV !== 'production';
console.info(`DEBUG == ${DEBUG}\t(NODE_ENV == ${process.env.NODE_ENV})`);

if (DEBUG) {
  config.plugins.unshift(multiEntry());
  config.entry = ['console/console.js', config.entry, 'console/mdm-console.js'];
} else {
  config.plugins.push(uglify());
}

export default config;
