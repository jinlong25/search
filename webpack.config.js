const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		index: './app/index.js'
	},
	module: {
		rules: [
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" }
				]
			},
			{ 
					test: /\.(png|jpg|gif|svg)$/,
					use: [
							{
									loader: 'file-loader',
									options: {
											name: '[path][name].[ext]',
											context: path.resolve(__dirname, "src/"),
											outputPath: 'dist/',
											publicPath: '../',
											useRelativePaths: true
									}
							}
					] 
			}
		]
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index_bundle.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'app/index.html'
		})
	],
	mode: 'development',
	node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}