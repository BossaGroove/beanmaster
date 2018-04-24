'use strict';

const config = require('./base');
const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

Object.assign(config, {
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		hot: true,
		quiet: false, // display nothing to the console
		publicPath: config.output.publicPath,
		// options for formatting the statistics
		stats: {
			colors: true,
			modules: false
		},
		allowedHosts: [
			'.ngrok.io'
		],
		watchOptions: {
			ignored: /node_modules/
		},
		proxy: {
			'/': 'http://localhost:3000'
		}
	}
});

config.plugins.push(
	new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('development')
		}
	}),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NamedModulesPlugin(),
	new ManifestPlugin({
		fileName: 'manifest.json',
		writeToFileEmit: true,
		publicPath: config.output.publicPath
	}),
	new CaseSensitivePathsPlugin()
);

config.module.rules.push(
	{
		test: /\.s?css$/,
		exclude: /(node_modules|globalStyle)/,
		use: [
			{
				loader: 'style-loader'
			},
			{
				loader: 'css-loader',
				options: {
					// modules: true,
					importLoaders: 2,
					localIdentName: '[name]__[local]',
					sourceMap: true
				}
			},
			{
				loader: 'postcss-loader',
				options: {sourceMap: true}
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true,
					includePaths: [path.resolve(__dirname, '../client')]
				}
			}
		]
	},
	{
		test: /\.s?css$/,
		include: /(node_modules|globalStyle)/,
		use: [
			{
				loader: 'style-loader'
			},
			{
				loader: 'css-loader',
				options: {
					sourceMap: true,
					importLoaders: 1
				}
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true,
					includePaths: [path.resolve(__dirname, '../client')]
				}
			}
		]
	}
);

config.entry.app = [
	'webpack-dev-server/client?http://localhost:4003',
	// 'webpack/hot/only-dev-server',
	// 'webpack-hot-middleware/client',
	'react-hot-loader/patch',
	'./index.jsx'
];

module.exports = config;
