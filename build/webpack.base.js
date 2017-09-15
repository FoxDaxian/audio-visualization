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
		}]
	}
}