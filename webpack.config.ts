import { merge } from 'webpack-merge';
import commonConfig from './webpack/webpack.common';
import bundleAnalyzer from './webpack/addons/bundleAnalyzer';
import devConfig from './webpack/webpack.development';
import prodConfig from './webpack/webpack.production';

// const env = process.env.NODE_ENV || 'development';

export default () => {
  const isAnalyze =
    process.env.ANALYZE === 'true' || process.env.analyze === 'true';

  const merged = merge(
    commonConfig,
    // use NODE_ENV to decided which environment config to merge with common config
    // environment defaults to development
    process.env.NODE_ENV === 'production' ? devConfig : prodConfig,
    isAnalyze ? bundleAnalyzer : {}
  );
  return merged;
};
