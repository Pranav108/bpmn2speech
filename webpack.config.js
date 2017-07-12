'use strict';

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let babelSettings = JSON.parse(fs.readFileSync('.babelrc'));

module.exports = {
  entry: {
    app: './index.js'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: babelSettings
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(bpmn|xml)$/,
        loader: 'html-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Inferno: 'inferno',
      Component: 'inferno-component'
    })
  ],
  devtool: 'source-map',
  devServer: {
    port: 8088,
    stats: 'minimal',
    open: true,
    contentBase: path.resolve(__dirname),
    publicPath: '/'
  }
};
