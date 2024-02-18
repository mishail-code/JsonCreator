const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './App/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.less$/i,
            use: ["style-loader", "css-loader", "less-loader"]
          }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Json Creator',
        template: './App/index.ejs',
        favicon: './App/JsonCreatorIcon.png'
      })
    ]
};