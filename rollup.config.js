import babel from 'rollup-plugin-babel';
import amd from 'rollup-plugin-amd';

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  },
  plugins: [
    amd(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};