var path = require("path");
var utils = require("./utils");
var config = require("../config");
var vueLoaderConfig = require("./vue-loader.conf");

const HappyPack = require("happypack");
const os = require("os");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  entry: {
    app: ["babel-polyfill", "./src/main.js"]
  },
  output: {
    path: config.build.assetsRoot,
    filename: "[name].[hash].bundle.js",
    chunkFilename: "[name].[hash].chunk.js",
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        // loader: 'vue-loader',
        // options: vueLoaderConfig
        use: ["happypack/loader?id=happy-vue-loader"]
      },
      {
        test: /\.js$/,
        // loader: 'babel-loader',
        use: ["happypack/loader?id=happy-babel-js"],
        include: [resolve("src"), resolve("test")]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: "happy-vue-loader",
      loaders: [
        {
          loader: "vue-loader",
          cacheDirectory: true,
          options: vueLoaderConfig // 添加到了此处
        }
      ],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: "happy-babel-js",
      loaders: ["babel-loader?cacheDirectory=true"],
      threadPool: happyThreadPool
    })
  ]
};
