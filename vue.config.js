
// const url = "https://10.0.0.156:58081";
// const url = "https://10.0.0.111:58081";

const url = "https://10.0.0.110:58081";
// const url = "https://10.0.0.202:58081";

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
    public: "localhost:8080" // sockjs-node/info 报错
  }
};
