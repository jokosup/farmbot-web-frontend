var webpack = require('webpack');
var generateConfig = require("./webpack.config.base");
var exec = require("child_process").execSync;
var path = require("path");

c = function () {
  var conf = generateConfig();

  conf.devtool = 'source-map';

  conf
    .plugins
    .push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.REVISION': JSON.stringify(
        exec('git log --pretty=format:"%h" -1').toString()),

    }));

  conf
    .plugins
    .push(new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
    }));

  return conf;
}
module.exports = c();


