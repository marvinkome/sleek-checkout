const path = require("path");
const webpack = require("webpack");
const copyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

const bundleOutputDir = "./dist";

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);

  return [
    {
      entry: "./src/index.tsx",

      output: {
        clean: true,
        filename: "sleek.js",
        path: path.resolve(bundleOutputDir),
        library: {
          name: "SleekPay",
          type: "umd",
          export: "default",
        },
      },

      devServer: {
        static: {
          directory: bundleOutputDir,
        },
      },

      plugins: [
        new webpack.DefinePlugin({
          __DEV__: process.env.NODE_ENV !== "production",
        }),

        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),

        new CompressionPlugin(),

        ...(isDevBuild
          ? [new webpack.SourceMapDevToolPlugin(), new copyWebpackPlugin({ patterns: [{ from: "dev/" }] })]
          : [new BundleAnalyzerPlugin()]),
      ],

      optimization: {
        minimize: !isDevBuild,
        minimizer: [new TerserPlugin()],
      },

      mode: isDevBuild ? "development" : "production",

      resolve: {
        extensions: ["*", ".js", ".ts", ".tsx"],
        alias: {
          react: "preact/compat",
          "react-dom/test-utils": "preact/test-utils",
          "react-dom": "preact/compat",
          "react/jsx-runtime": "preact/jsx-runtime",
        },
        fallback: {
          os: require.resolve("os-browserify"),
          https: require.resolve("https-browserify"),
          http: require.resolve("http-browserify"),
          stream: require.resolve("stream-browserify"),
          buffer: require.resolve("buffer"),
        },
      },

      module: {
        rules: [
          // packs SVG's discovered in url() into bundle
          { test: /\.svg/, use: "svg-url-loader" },
          {
            test: /\.css$/i,
            use: [
              {
                loader: "style-loader",
                options: {
                  injectType: "lazyStyleTag",
                  insert: function insertIntoTarget(element, options) {
                    let parent = options.target || document.head;

                    parent.appendChild(element);
                  },
                },
              },
              "css-loader",
              "postcss-loader",
            ],
          },
          // use babel-loader for TS and JS modeles,
          // starting v7 Babel babel-loader can transpile TS into JS,
          // so no need for ts-loader
          // note, that in dev we still use tsc for type checking
          {
            test: /\.(js|ts|tsx|jsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        targets: {
                          browsers: ["IE 11, last 2 versions"],
                        },
                        // makes usage of @babel/polyfill because of IE11
                        // there is at least async functions and for..of
                        useBuiltIns: "usage",

                        // leave the imports/export syntax untouched
                        modules: false,
                      },
                    ],
                    [
                      // enable transpiling ts => js
                      "@babel/typescript",
                      // tell babel to compile JSX using into Preact
                      { jsxPragma: "h" },
                    ],
                  ],
                  plugins: [
                    // syntax sugar found in React components
                    "@babel/proposal-class-properties",
                    "@babel/proposal-object-rest-spread",
                    // transpile JSX/TSX to JS
                    [
                      "@babel/plugin-transform-react-jsx",
                      {
                        // we use Preact, which has `Preact.h` instead of `React.createElement`
                        pragma: "h",
                        pragmaFrag: "Fragment",
                      },
                    ],
                  ],
                },
              },
            ],
          },
          {
            test: /\.(js|ts|tsx)$/,
            use: [
              {
                loader: "magic-comments-loader",
                options: { webpackMode: "eager" },
              },
            ],
          },
        ],
      },
    },
  ];
};
