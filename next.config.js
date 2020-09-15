// next.config.js
const withPlugins = require("next-compose-plugins")
const optimizedImages = require("next-optimized-images")
const withPrefresh = require("@prefresh/next")
const path = require("path")

module.exports = withPlugins([withPrefresh, optimizedImages], {
  webpack: (config, { dev, isServer }) => {
    // =================================== Use preact config
    const splitChunks = config.optimization && config.optimization.splitChunks
    if (splitChunks) {
      const { cacheGroups } = splitChunks
      const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/
      if (cacheGroups.framework) {
        cacheGroups.preact = { ...cacheGroups.framework, test: preactModules }
        cacheGroups.commons.name = "framework"
      } else {
        cacheGroups.preact = {
          name: "commons",
          chunks: "all",
          test: preactModules,
        }
      }
    }

    // Install webpack aliases:
    const aliases = config.resolve.alias || (config.resolve.alias = {})
    aliases.react = aliases["react-dom"] = "preact/compat"
    aliases.preact = path.resolve(__dirname, "node_modules", "preact")

    // inject Preact DevTools
    if (dev && !isServer) {
      const { entry } = config
      config.entry = () =>
        entry().then((entries) => {
          entries["main.js"] = ["preact/debug"].concat(entries["main.js"] || [])
          return entries
        })
    }
    // ===================================== Use preact config

    return config
  },
})
