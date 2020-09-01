import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { ROOT, SRC, DIST } from './common-paths';

// see here on how to split config between dev and prod builds
// https://webpack.js.org/guides/environment-variables/
const webpackConfig: webpack.Configuration = {
  context: ROOT, // to automatically find tsconfig.json
  entry: SRC + '/index.tsx',
  output: {
    path: DIST,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          { loader: 'babel-loader' },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              allowTsInNodeModules: true,
              // this overrides the specified properties in tsconfig.json
              compilerOptions: {
                // setting as CommonJS prevented webpack code splitting
                module: 'esnext',
                sourceMap: true,
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\/fonts\/.*\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]',
      },
      {
        test: [/\/images\/.*\.svg$/, /@coreui\/icons/],
        loader: 'svg-react-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    // prevent file hashes changing unexpectedly
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: SRC + '/index.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],

  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
            annotation: true,
          },
        },
      }),
      new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
        extractComments: false,
      }),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      name: false,
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: (module: any) => {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
        styles: {
          test: /\.css$/,
          enforce: true,
        },
      },
    },
  },
};

export default webpackConfig;
