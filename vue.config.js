
const url = "https://10.0.0.121:58081";

module.exports = {
  lintOnSave: false, // 关闭eslint
  publicPath: "./", // 填后端public路径的坑
  css: {
    loaderOptions: {},
    requireModuleExtension: true
  },
  devServer: {
    https: true,
    // disableHostCheck: true,

    proxy: {
      "/": {
        target: url,
        ws: true,
        changeOrigin: true
      }
    },
    public: "10.0.0.164:8080" // sockjs-node/info 报错
  }
};
