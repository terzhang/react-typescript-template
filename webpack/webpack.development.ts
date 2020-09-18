import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { DIST } from './common-paths';
import commonLoaders from './common-loaders';
import webpack from 'webpack';
import { Configuration } from 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
const tsLoader = {
  loader: 'ts-loader',
  options: {
    transpileOnly: true,
    // experimentalWatchApi: true,
    // allowTsInNodeModules: true,
    // this overrides the specified properties in tsconfig.json
    compilerOptions: {
      // setting as CommonJS prevented webpack code splitting
      module: 'esnext',
      sourceMap: true,
    },
  },
};

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
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                // Applies the react-refresh Babel plugin on non-production modes only
                require.resolve('react-refresh/babel'),
              ],
            },
          },
          tsLoader,
        ],
      },
      {
        test: /\.((c|sa|sc)ss)$/i,
        exclude: /node_modules/,
        use: [
          // style-loader only in development
          {
            loader: 'style-loader',
            options: {
              esModule: true,
            },
          },
          ...commonLoaders,
        ],
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin(), new ReactRefreshWebpackPlugin()],
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
