module.exports = {
  entry: './src/js/load.js',
  output: {
    filename: './public/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?mimetype=image/svg+xml' },
      { test: /\.woff(\d+)?(\?v=\d+\.\d+\.\d+|\?[a-zA-Z0-9]+)?$/, loader: 'url-loader?mimetype=application/font-woff' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+|\?[a-zA-Z0-9]+)?$/, loader: 'url-loader?mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+|\?[a-zA-Z0-9]+)?$/, loader: 'url-loader?mimetype=application/font-woff' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
