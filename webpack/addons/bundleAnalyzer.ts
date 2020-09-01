import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
    }),
  ],
};
