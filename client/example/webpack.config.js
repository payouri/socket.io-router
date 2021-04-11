const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./src/index.ts"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
    // publicPath: "/assets/",
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "./src"),
      path.resolve(__dirname, "../node_modules"),
    ],
    alias: {
      "@commons": path.resolve(__dirname, "../../commons"),
    },
    extensions: [".js", ".ts", ".d.ts"],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
    historyApiFallback: true,
    inline: true,
    open: true,
    hot: true,
  },
  devtool: "eval-source-map",
  watch: true,
  module: {
    // configuration regarding modules
    rules: [
      // rules for modules (configure loaders, parser options, etc.)
      {
        // Conditions:
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-typescript",
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: [">0.25%", "ie >= 11"],
                },
                corejs: 3,
                useBuiltIns: "entry",
              },
            ],
          ],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-object-rest-spread",
          ],
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          context: __dirname,
          transpileOnly: true,
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
