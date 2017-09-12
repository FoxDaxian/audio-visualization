const express = require('express')
const webpackDevMiddleware = require("webpack-dev-middleware")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.js')

base.entry = ['webpack-hot-middleware/client?noInfo=true&reload=true', base.entry]
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
	stats:{
		colors: true,
		chunks: false
	}
}))
app.use(require("webpack-hot-middleware")(compiler))
app.use(express.static(require("path").resolve(__dirname, '../')))

app.listen(3000, function (err) {
	if (err) {
		console.log('出错了')
		return false
	}
	console.log("Listening on port 3000!");
});