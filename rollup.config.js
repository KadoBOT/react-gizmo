import babel from "rollup-plugin-babel";
import amd from "rollup-plugin-amd";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.js",
  output: {
    file: "bundle.js",
    format: "cjs"
  },
  plugins: [
    postcss({
      extensions: [".css"]
    }),
    amd(),
    babel({
      exclude: "node_modules/**",
      externalHelpers: false,
      runtimeHelpers: true
    })
  ]
};
