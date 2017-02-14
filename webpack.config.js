module.exports = {
  entry: {
    entry: "./app.js",
  },
  output:
  {
    path: __dirname + "/dist",
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        // loader: 'babel',
        exclude: /node_modules/
      },
    ]
  }
}
