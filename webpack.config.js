module.exports = {
  context: __dirname + '/src',
  entry: {
    'fnlux': ['./index.js'],
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].min.js',
    library: 'createFnlux',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  },
};