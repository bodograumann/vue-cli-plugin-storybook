module.exports = {
  webpack: (config, { api, options }) => {
    const chainConfig = api.resolveChainableWebpackConfig();
    const existingPlugins = chainConfig.plugins.values().map(item => item.name);
    const allowedPlugins = [
      'vue-loader',
      'friendly-errors',
      'no-emit-on-errors',
      'extract-css',
      'optimize-css',
      'hash-module-ids',
    ];

    existingPlugins.forEach((plugin) => {
      if (!allowedPlugins.includes(plugin) && !options.allowedPlugins.includes(plugin)) {
        chainConfig.plugins.delete(plugin);
      }
    });

    const resolvedChain = chainConfig.toConfig();
    const webpackConfig = api.resolveWebpackConfig();

    return {
      ...config,
      plugins: [...config.plugins, ...resolvedChain.plugins],
      module: {
        ...config.module,
        ...webpackConfig.module,
      },
      resolve: {
        ...webpackConfig.resolve,
        alias: {
          ...webpackConfig.resolve.alias,
          vue$: require.resolve('vue/dist/vue.esm.js'),
        },
      },
      resolveLoader: resolvedChain.resolveLoader,
    };
  },
  webpackFinal: config => ({
    ...config,
    module: {
      ...config.module,
      // Remove duplicate rules added by storybook
      // https://github.com/storybooks/storybook/blob/v4.1.0/lib/core/src/server/preview/base-webpack.config.js
      rules: config.module.rules.slice(0, -3),
    },
  }),
};
