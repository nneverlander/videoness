var webpack = require('webpack');
var path = require('path');
var dist_dir = path.resolve(__dirname, 'dist');
var src_dir = path.resolve(__dirname, 'src');

var config = {
  // Makes sure errors in console map to the correct file
  // and line number
  devtool: 'eval',

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    src_dir + '/components/index/index.jsx'
  ],
  output: {
    path: dist_dir,
    filename: 'Videoness.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        include: src_dir,
        loaders: ['react-hot', 'babel']
      },
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.jpg$/, loader: "file-loader"},
      {test: /\.(png|eot|svg|ttf|woff|woff2)$/, loader: "url-loader?limit=100000"}
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]

};

module.exports = config;
