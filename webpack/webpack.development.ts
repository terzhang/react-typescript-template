import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { DIST } from './common-paths';
import commonLoaders from './common-loaders';
import webpack from 'webpack';
import { Configuration } from 'webpack-dev-server';

const devConfig: webpack.Configuration = {
  mode: 'development',
  output: {
    filename: '[name].[hash].js',
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                // Applies the react-refresh Babel plugin on non-production modes only
                require.resolve('react-refresh/babel'),
              ],
            },
          },
        ],
      },
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          // style-loader only in development
          'style-loader',
          ...commonLoaders,
        ],
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer: {
    contentBase: DIST,
    compress: true,
    port: 7777,
    historyApiFallback: true,
    writeToDisk: true,
    hot: true,
  } as Configuration,
};
export default devConfig;
