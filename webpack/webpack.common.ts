import webpack from 'webpack';
// import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { ROOT, SRC, DIST } from './common-paths';

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
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.svg', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.(webm|mp4|gifv?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      // config for ts(x)/js(x) using svgr
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: {
          test: /\.tsx?$/,
        },
        use: [
          'babel-loader',
          {
            loader: '@svgr/webpack',
            options: {
              // typescript: false,
              babel: false,
            },
          },
          'url-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          // { loader: 'babel-loader' },
          tsLoader,
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
      },
      // everything else that uses svgr
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: SRC + '/index.html',
    }),
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
