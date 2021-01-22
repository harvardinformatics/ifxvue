module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['cache-loader', 'style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['cache-loader', 'style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
