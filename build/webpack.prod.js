const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const base = require('./webpack.base.js')
const shell = require('shelljs')
const ora = require('ora')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const prod_config = merge(base, {
	devtool: "source-map",
	plugins: [new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		minChunks: function(module) {
			return module.context && module.context.indexOf('node_modules') !== -1;
		}
	}), new webpack.optimize.CommonsChunkPlugin({
		name: 'manifest',
		chunks: ['vendor']
	}), new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		},
		sourceMap: true // 不能少，不然不生成map，得配合devTool
	}), new HtmlWebpackPlugin({
		template:path.resolve(__dirname,'../src/index.html'),
		title: "audio visualization",
		filename: 'index.html',
		inject:true,
		minify: {
			removeComments: true,
			collapseWhitespace: true,
			removeAttributeQuotes: true,
			minifyCSS:true,
			minifyJS:true
		}
	})]
})

const spinner = ora('packing....')
spinner.start()
shell.rm('-rf', path.resolve(__dirname, '../dist'))
shell.mkdir('-p', path.resolve(__dirname, '../dist'))
shell.cp('-R', path.resolve(__dirname, '../public/'), path.resolve(__dirname, '../dist/public/'))
shell.echo('pack start')
shell.echo('*------------------------*\n')

const compiler = webpack(prod_config)

compiler.run((err, stats) => {
	spinner.stop()
	if (err) {
		console.log(err)
		return
	}
	process.stdout.write(stats.toString({
		colors: true,
		modules: false,
		children: false,
		chunks: false,
		chunkModules: false
	}) + '\n\n')
})
