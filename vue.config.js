const url = "https://10.0.0.210:58081";

module.exports = {
  css: {
    loaderOptions: {},
    requireModuleExtension: true,
  },
  devServer: {
    https: true,

    proxy: {
      "/": {
        target: url,

        ws: true,
        changeOrigin: true,
      },
    },
  },
};
