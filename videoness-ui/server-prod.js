/**
 * Created by adi on 7/10/16.
 */

//todo this file needs to be changed
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  contentBase: config.output.path,
  hot: false,
  historyApiFallback: true,
}).listen(80, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }
  console.log('Listening at http://localhost/');
});
