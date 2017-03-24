var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-dev-server/client?http://localhost:8888');
    sources.push('webpack/hot/only-dev-server');
  }

  return sources;
}

module.exports = {
  entry: {
    devices: getEntrySources([
        './src/js/index.js'
    ])
  },
  output: {
    publicPath: 'http://localhost:8888/',
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 8888,
    host: "0.0.0.0",
    // contentBase: path.join(__dirname, "dist"),
    publicPath: "http://localhost:8888/"
  },
  module: {
    loaders: [
        { test: /\.js$/, loaders: ['react-hot', 'jsx', 'babel'], exclude: /(node_modules|src\/components)/ },
        { test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml'},
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
        { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"}
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/html/index.html', to: 'index.html' },
      { from: 'src/components', to: 'components' },
      { from: 'node_modules/leaflet/dist/leaflet.css', to: 'leaflet.css' },
      { from: 'node_modules/leaflet/dist/images', to: 'images' },
      { from: 'src/img', to: 'images' }
    ])
  ]
};
