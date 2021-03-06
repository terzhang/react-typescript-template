import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin, { loader } from 'mini-css-extract-plugin';
import webpack from 'webpack';
import commonLoaders from './common-loaders';

// https://webpack.js.org/guides/environment-variables/
const prodConfig: webpack.Configuration = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          // extract the CSS from bundle to use parallel loading of CSS/JS resources later on
          {
            loader,
            options: {
              // esModule: true,
              modules: {
                namedExport: true,
              },
            },
          },
          ...commonLoaders,
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
    new CleanWebpackPlugin(),
  ],
};

export default prodConfig;
