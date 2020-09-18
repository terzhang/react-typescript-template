// setup according to https://github.com/pmmmwh/react-refresh-webpack-plugin
// babel config doc: https://babeljs.io/docs/en/configuration
export default (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      '@babel/preset-env',
      ['@babel/preset-react', { modules: false }],
      [
        '@babel/preset-typescript',
        {
          // this is important for proper files watching
          onlyRemoveTypeImports: true,
        },
      ],
    ],
    plugins: [
      // // Applies the react-refresh Babel plugin on non-production modes only
      // !api.env('production') && require.resolve('react-refresh/babel'),
      // require the Babel runtime as a separate module to avoid duplication
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
        },
      ],
    ].filter(Boolean),
  };
};
