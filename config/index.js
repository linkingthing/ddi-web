// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var https = require('https');
var fs = require('fs');

let assetsPublicPath = './';

module.exports = {
	build: {
		env: require('./prod.env'),
		index: path.resolve(__dirname, '../dist/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: assetsPublicPath,
		productionSourceMap: false,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: [ 'js', 'css' ],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: true // process.env.npm_config_report ranck
	},
	dev: {
		env: require('./dev.env'),
		port: 8082,
		autoOpenBrowser: true,
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		https: {
			key: fs.readFileSync(path.join(__dirname, './cert/server.key')),
			cert: fs.readFileSync(path.join(__dirname, './cert/server.crt'))
		},
		proxyTable: {
			'/login': {
				target: 'https://10.0.0.90:8081',
				secure: false, // 如果是https接口，需要配置这个参数
			},
			'/apis': {
				target: 'https://10.0.0.90:8081/apis',

				changeOrigin: true,
				ws: true, //如果要代理 websockets，配置这个参数
				secure: false, // 如果是https接口，需要配置这个参数
				//重写路径
				pathRewrite: {
					'^/apis': '' //例如 /api/getuser或被重写为 /abc/xxx/getuser
				}
			},

			'/public': {
				target: 'https://10.0.0.90:8081/public',
				changeOrigin: true,
				// ws: true,        //如果要代理 websockets，配置这个参数
				secure: false, // 如果是https接口，需要配置这个参数
				//重写路径
				pathRewrite: {
					'^/public': '' //例如 /api/getuser或被重写为 /abc/xxx/getuser
				}
			}
		},
		// CSS Sourcemaps off by default because relative paths are "buggy"
		// with this option, according to the CSS-Loader README
		// (https://github.com/webpack/css-loader#sourcemaps)
		// In our experience, they generally work as expected,
		// just be aware of this issue when enabling this option.
		cssSourceMap: false
	},
	PACK_SYSTEM: process.argv.slice(2).length ? `"${process.argv.slice(2).join()}"` : "'dns,monitor,address,system'"
};

console.log(
	'正在生成',
	process.argv.slice(2).length ? process.argv.slice(2) : [ 'dns', 'monitor', 'address', 'system' ],
	'相关模块'
);
console.log('正在生成...');
console.log('正在生成......');
console.log('正在生成.........');
