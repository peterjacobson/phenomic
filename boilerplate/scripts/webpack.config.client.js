import path from "path"

import webpackConfig from "./webpack.config.babel.js"
import pkg from "../package.json"

// ! client side loader only \\
export default {
  ...webpackConfig,
  module: {
    ...webpackConfig.module,
    loaders: [
      ...webpackConfig.module.loaders,
      {
        test: /\.json$/,
        loader: "json-loader",
      },
      {
        test: /\.js$/,
        loaders: [
          "babel-loader?" +
          // hack for babel config to undo babel-plugin-webpack-loaders effect
          JSON.stringify({
            ...pkg.babel,
            // forget "statinamic" env
            env: { ...pkg.babel.env, "statinamic": undefined },
            // prevent babel going to use your original config
            babelrc: false,
          }),
          "eslint-loader?fix",
        ],
        exclude: /node_modules/,
      },
    ],
  },

  // ↓ HANDLE WITH CARE ↓ \\

  output: {
    ...webpackConfig.output,
    libraryTarget: "var",
    filename: "[name].js",
  },
  entry: {
    "statinamic-client": path.join(__dirname, "index-client"),
  },
}
