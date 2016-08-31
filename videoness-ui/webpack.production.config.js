var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var dist_dir = path.resolve(__dirname, 'dist');
var src_dir = path.resolve(__dirname, 'src');

var config = {
  devtool: "cheap-module-source-map",
  entry: [
    src_dir + '/components/index/index.jsx',
  ],
  output: {
    path: dist_dir,
    filename: 'Videoness.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        include: src_dir,
        loaders: ['babel']
      },
      {test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader')},
      {test: /\.png$/, loader: "url-loader?limit=100000"},
      {test: /\.jpg$/, loader: "file-loader"}
    ]
  },
  plugins: [
    new ExtractTextPlugin('Videoness.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]

};

module.exports = config;
