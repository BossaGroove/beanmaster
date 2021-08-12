const webpack = require('webpack');
const path = require('path');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const config = require('./base');

Object.assign(config, {
	devtool: 'cheap-module-source-map',
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
	new webpack.HotModuleReplacementPlugin(),
	new WebpackManifestPlugin({
		fileName: 'manifest.json',
		writeToFileEmit: true,
		publicPath: config.output.publicPath
	}),
	new CaseSensitivePathsPlugin(),
	new webpack.EnvironmentPlugin({
		NODE_ENV: 'development',
		DEBUG: false
	})
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
					modules: {
						localIdentName: '[name]__[local]',
					},
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
					sassOptions: {
						includePaths: [path.resolve(__dirname, '../client')],
					},
					sourceMap: true
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
				loader: 'postcss-loader',
				options: {sourceMap: true}
			},
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true,
					sassOptions: {
						includePaths: [path.resolve(__dirname, '../client')]
					}
				}
			}
		]
	}
);

config.entry.app = [
	'webpack-dev-server/client?http://localhost:4000',
	'./index.jsx'
];

module.exports = config;
