import { Configuration } from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { resolveApp } from './kit';

export default {
	entry: resolveApp('packages/index.ts'),
	output: {
		path: resolveApp(''),
		filename: 'anm.umd.js',
		libraryTarget: 'umd',
		library:"anm"
	},
	mode: 'production',
	devtool: 'source-map',
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
				test: /\.ts/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'ts-loader'
					}
				]
			}
		]
	},
	resolve: {
		extensions: [ '.ts', '.js', '.json' ],
		// plugins: [ new TsconfigPathsPlugin() ]
	},
} as Configuration;
