const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const config = require('./base');

config.output.filename = '[name]-[chunkhash].js';
config.output.chunkFilename = '[name]-[chunkhash].js';
config.output.publicPath = '/';

config.module.rules.push(
	{
		test: /\.s?css$/,
		exclude: /(node_modules|globalStyle)/,
		use: [
			MiniCssExtractPlugin.loader,
			{
				loader: 'css-loader',
				options: {
					modules: {
						localIdentName: '[name]__[local]',
					},
					importLoaders: 3
				}
			},
			{
				loader: 'postcss-loader'
			},
			{
				loader: 'sass-loader',
				options: {
					sassOptions: {
						includePaths: [path.resolve(__dirname, '../client')]
					}
				}
			}
		]
	},
	{
		test: /\.s?css$/,
		include: /(node_modules|globalStyle)/,
		use: [
			MiniCssExtractPlugin.loader,
			{
				loader: 'css-loader',
				options: {
					importLoaders: 3
				}
			},
			{
				loader: 'postcss-loader'
			},
			{
				loader: 'sass-loader',
				options: {
					sassOptions: {
						includePaths: [path.resolve(__dirname, '../client')]
					}
				}
			}
		]
	}
);

config.plugins.push(
	new MiniCssExtractPlugin({
		filename: '[name]-[contenthash].css',
		chunkFilename: '[name]-[contenthash].css'
	}),
	new WebpackManifestPlugin({
		fileName: 'manifest.json',
		writeToFileEmit: true,
		publicPath: config.output.publicPath
	}),
	new BundleAnalyzerPlugin()
);

module.exports = config;
