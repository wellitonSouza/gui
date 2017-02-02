var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    helloWorld: './src/js/helloWorld.js'
  },
  output: {
    publicPath: 'http://localhost:8888/',
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
        {
            test: /\.js$/,
            loaders: ['jsx', 'babel'],
            exclude: /node_modules/
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css!sass')
        }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css', {
      allChunks: true
    }),

    new CopyWebpackPlugin([
      { from: 'src/html/index.html', to: 'index.html' },
      { from: 'src/components', to: 'components' }
    ]),

    new webpack.DefinePlugin({
      'process.env' : {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
