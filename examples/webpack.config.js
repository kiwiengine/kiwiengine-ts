const path = require('path');

module.exports = {
  entry: {
  },
  output: {
    filename: '[name]/dist/game.js',
    path: path.resolve(__dirname, './'),
    chunkFormat: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    client: {
      overlay: false,
      logging: 'none'
    },
    open: true
  }
};