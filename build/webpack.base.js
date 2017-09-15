const path = require('path')

module.exports = {
	entry: {
		main: path.resolve(__dirname, '../src/index.js')
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'static/js/[name].js',
		publicPath: '/'
	},
	module: {
		rules: [{
			test: /\.js$/,
			include: path.resolve(__dirname, '../src/'),
			exclude: /(node_modules|bower_components)/,
			use: 'babel-loader'
		}, { // 处理图片,####超过尺寸会使用file-loader，所以记得下载
			test:/\.(png|jpe?g|gif|svg)(\?.*)?$/,
			use:[{
				loader:"url-loader",
				options:{
					limit:10000,
					name:"static/img/[name].[hash].[ext]"
				}
			}]

		}]
	}
}