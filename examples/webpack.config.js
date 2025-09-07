const path = require('path')

module.exports = {
  entry: {

    'renderer-test': './renderer-test/index.ts',
    'dom-test': './dom-test/index.ts',
    'sprite-test': './sprite-test/index.ts',
    'collision-test': './collision-test/index.ts',
    'spine-test': './spine-test/index.ts',
    'particle-test': './particle-test/index.ts',
    'dom-sprite-test': './dom-sprite-test/index.ts',
    'dom-particle-test': './dom-particle-test/index.ts',

    'flappy-cat': './flappy-cat/index.ts',
    'simple-battle': './simple-battle/index.ts',
    'auto-battle': './auto-battle/index.ts',
    'battle-benchmark-matterjs': './battle-benchmark-matterjs/index.ts',
    'battle-benchmark-separation': './battle-benchmark-separation/index.ts',
    'battle-benchmark-separation2': './battle-benchmark-separation2/index.ts',
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
}