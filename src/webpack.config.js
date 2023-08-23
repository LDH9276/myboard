const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      // ...
    ],
  },
  plugins: [
    // ...
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        ckeditor: {
          test: /[\\/]node_modules[\\/]@ckeditor[\\/]/,
          name: 'ckeditor',
          priority: 10,
          enforce: true,
        },
      },
    },
  },
};