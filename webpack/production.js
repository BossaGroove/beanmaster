const config = require('./base');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
	}),
	new BundleAnalyzerPlugin()
);

module.exports = config;
