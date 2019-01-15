import { resolveApp } from './kit';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
const CleanWebpackPlugin = require('clean-webpack-plugin');

export default {
	mode: 'development',
	entry: [ 'webpack-hot-middleware/client', resolveApp('examples/index.tsx') ],
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.js/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.tsx?/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader'
					}
				]
			},
			// for examples
			{
				test: /\.css/,
				exclude: /node_modules/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.less/,
				exclude: /node_modules/,
				use: [ 'style-loader', 'css-loader', 'less-loader' ]
			}
		]
	},
	resolve: {
		extensions: [ '.ts', '.js', '.json' ],
		// plugins: [ new TsconfigPathsPlugin() ]
	},
	plugins: [
		new CleanWebpackPlugin([ 'dist' ]),
		new HtmlWebpackPlugin({
			title: 'Dev Examples',
			name: 'index',
			template: resolveApp('examples/index.html')
		}),
		new webpack.optimize.OccurrenceOrderPlugin(false),
		new webpack.HotModuleReplacementPlugin(),
		// new webpack.NoEmitOnErrorsPlugin()
	],
	output: {
		filename: '[name].bundle.js',
		path: resolveApp('dist'),
		publicPath: '/'
	} 
} as webpack.Configuration;
