const path = require('path')

module.exports = {
	entry: path.resolve(__dirname, '../src/index.js'),
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'audio_visualization.js',
		publicPath: '/'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: 'babel-loader'
		}]
	},
	// plugins: [
	// new webpack.optimize.UglifyJsPlugin()
	// ]
}