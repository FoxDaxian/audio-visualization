const express = require('express')
const webpackDevMiddleware = require("webpack-dev-middleware")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.js')

Object.keys(base.entry).forEach(function (el) {
	// noInfo 取消控制台打印，reload 刷新浏览器
	base.entry[el] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(base.entry[el])
})
const dev_config = merge(base, {
 	devtool: "eval-source-map",
	plugins: [new HtmlWebpackPlugin({
		template: path.resolve(__dirname,"../src/index.html"),
		filename: 'index.html',
		inject: true
	}),
	new webpack.HotModuleReplacementPlugin()]
})

const app = express()
const compiler = webpack(dev_config)

app.use(webpackDevMiddleware(compiler, {
	publicPath: "/",
	stats: {
		colors: true,
		chunks: false // 和webpack版本有关系
	}
}))
app.use(require("webpack-hot-middleware")(compiler))

app.use(express.static(require("path").resolve(__dirname, '../')))

app.listen(3000, function (err) {
	if (err) {
		console.log('出错了')
		return false
	}
	console.log("Listening on port 3000!")
})
