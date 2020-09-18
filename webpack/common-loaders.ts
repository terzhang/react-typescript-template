const loaders = [
  {
    loader: 'css-loader',
    options: {
      // configure how many loaders before css-loader should be applied to @imported resources
      // do not forget that `sass-loader` compile non CSS `@import`'s into a single file
      // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
      importLoaders: 2,
      // Automatically enable css modules for files satisfying `/\.module\.\w+$/i` RegExp.
      modules: {
        compileType: 'module',
        mode: 'local',
        auto: true,
        exportGlobals: true,
        localIdentName: '[local]__[hash:base64:5]',
        // namedExport: true,
        exportLocalsConvention: 'camelCase',
        exportOnlyLocals: false,
      },
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: ['autoprefixer'],
      },
    },
  },
  {
    loader: 'sass-loader',
    options: {
      implementation: require('sass'),
    },
  },
];

export default loaders;
