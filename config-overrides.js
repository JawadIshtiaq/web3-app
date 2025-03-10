const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    assert: require.resolve("assert/"),
    url: require.resolve("url/"),
    util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
    os: require.resolve("os-browserify/browser"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );
  return config;
};