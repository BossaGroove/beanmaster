'use strict';

const config = require('./base');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');

config.output.filename = '[name]-[chunkhash].js';
config.output.chunkFilename = '[name]-[chunkhash].js';
config.output.publicPath = '/';

config.module.rules.push(
	{
		test: /\.s?css$/,
		exclude: /(node_modules|globalStyle)/,
		use: ExtractTextPlugin.extract({
			fallback: 'style-loader',
			use: [
				{
					loader: 'css-loader',
					options: {
						importLoaders: 3,
						minimize: true
					}
				},
				{
					loader: 'clean-css-loader'
				},
				{
					loader: 'postcss-loader'
				},
				{
					loader: 'sass-loader',
					options: {
						includePaths: [path.resolve(__dirname, '../client')]
					}
				}
			]
		})
	},
	{
		test: /\.s?css$/,
		include: /(node_modules|globalStyle)/,
		use: ExtractTextPlugin.extract({
			fallback: 'style-loader',
			use: [
				{
					loader: 'css-loader',
					options: {
						importLoaders: 3,
						minimize: true
					}
				},
				{
					loader: 'clean-css-loader'
				},
				{
					loader: 'postcss-loader'
				},
				{
					loader: 'sass-loader',
					options: {
						includePaths: [path.resolve(__dirname, '../client')]
					}
				}
			]
		})
	},
	{
		test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
		use: [
			{
				loader: 'url-loader',
				options: {
					limit: 10000,
					mimetype: 'application/font-woff'
				}
			}
		]
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		use: [
			{
				loader: 'url-loader',
				options: {
					limit: 10000,
					mimetype: 'application/octet-stream'
				}
			}
		]
	},
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		use: [
			{
				loader: 'file-loader'
			}
		]
	},
	{
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
		loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
	},
	{
		test: /\.(gif|jpe?g)$/i,
		use: [
			'file-loader',
			{
				loader: 'image-webpack-loader',
				options: {
					bypassOnDebug: true,
				},
			},
		],
	}
);

config.plugins.push(
	new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('production')
		}
	}),
	new webpack.optimize.UglifyJsPlugin(),
	new ExtractTextPlugin({
		filename: '[name]-[contenthash].css',
		allChunks: true
	}),
	new ManifestPlugin({
		fileName: 'manifest.json',
		writeToFileEmit: true,
		publicPath: config.output.publicPath
	})
);

module.exports = config;
