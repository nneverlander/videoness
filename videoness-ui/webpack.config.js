var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var dist_dir = path.resolve(__dirname, 'dist');
var src_dir = path.resolve(__dirname, 'src');

var config = {
  // Makes sure errors in console map to the correct file
  // and line number
  devtool: 'eval',
  // We change to normal source mapping
  //devtool: 'source-map',

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
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
        loaders: ['react-hot', 'babel']
      },
      //{test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.png$/, loader: "url-loader?limit=100000"},
      {test: /\.jpg$/, loader: "file-loader"}
    ]
  },
  plugins: [
    new ExtractTextPlugin('Videoness.css'), //todo see extract plugin for css extraction
    new webpack.HotModuleReplacementPlugin()
  ]

};

module.exports = config;
