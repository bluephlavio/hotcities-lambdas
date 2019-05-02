const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  },
  devtool: 'nosources-source-map',
  externals: [nodeExternals()],
  plugins: [
    new webpack.IgnorePlugin(/^\/opt/),
    new CopyWebpackPlugin([
      './google-app-credentials.json',
      './firebase-config.json',
      './geonameids.csv'
    ])
  ],
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  }
};
