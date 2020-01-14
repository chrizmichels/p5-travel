const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ulog = require("ulog");

module.exports = {
  entry: "./src/client/index.js",
  output: {
    libraryTarget: "var",
    library: "Client",
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
    /*   // Create a dir dist in the project root
    path: path.resolve(__dirname, "dist"),
    // filename
    filename: "bundle.js",
    // The URL relative to the HTML file
    // Since we are starting with '/', webpack will always look
    // into http://example.com/dist/bundle.js
    // no matter the current URL
    publicPath: "./src/client/media/" */
  },
  node: {
    fs: "empty"
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
      },
      "/getForecast": {
        target: "http://localhost:8085",
        secure: false
      },
      "/getPictures": {
        target: "http://localhost:8085",
        secure: false
      },
      "/getLocation": {
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
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "media/",
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
          options: {
            root: path.resolve(__dirname, "src"),
            attrs: ["img:src", "link:href"]
          }
        }
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
