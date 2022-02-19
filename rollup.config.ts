import { terser } from "rollup-plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-import-css";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";
import gzipPlugin from "rollup-plugin-gzip";

export default {
  input: "./src/index.tsx",
  output: [
    {
      file: "./dist/sleek.min.js",
      format: "iife",
      name: "SleekPay",
      plugins: [terser()],
    },
  ],
  plugins: [
    css(),
    json(),
    typescript(),
    alias({
      entries: [
        { find: "react", replacement: "preact/compat" },
        { find: "react-dom/test-utils", replacement: "preact/test-utils" },
        { find: "react-dom", replacement: "preact/compat" },
        { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
      ],
    }),

    resolve({ preferBuiltins: false }),
    commonjs(),
    nodePolyfills(),
    gzipPlugin(),
    visualizer({ open: true, gzipSize: true }),
  ],

  inlineDynamicImports: true,
};
