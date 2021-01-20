var url = "https://10.0.0.121:58081";

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {},
    requireModuleExtension: true
  },
  devServer: {
    https: true,

    proxy: {
      "/": {
        target: url,

        ws: true,
        changeOrigin: true
      }
    }
  }
};
