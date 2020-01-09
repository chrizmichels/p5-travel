const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ulog = require("ulog");

module.exports = {
  entry: "./src/client/index.js",
  output: {
    libraryTarget: "var",
    library: "Client"
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    contentBase: "./dist",
    host: "localhost", // Defaults to `localhost`
    port: 3000, // Defaults to 8080
    proxy: {
      "/getSentiment": {
        target: "http://localhost:8085",
        secure: false
      }
    }
  },
  module: {
    rules: [
      {
        test: "/.js$/",
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/client/views/index.html",
      filename: "./index.html"
    }),
    new CleanWebpackPlugin({
      // Simulate the removal of files
      dry: true,
      // Write Logs to Console
      verbose: true,
      // Automatically remove all unused webpack assets on rebuild
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: false
    }),

    new webpack.HotModuleReplacementPlugin({
      multiStep: true
    })
  ]
};
