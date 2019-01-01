const path = require('path');

const BUILD_DIR = path.resolve('dist');
const APP_DIR = path.resolve('src');

module.exports = {
  entry: path.join(APP_DIR, 'index.jsx'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
