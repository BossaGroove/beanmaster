'use strict';

const path = require('path');
const webpack = require('webpack');
const resourceFolder = path.resolve(__dirname, '../client');

const config = {
	context: resourceFolder,
	entry: {
		vendor: [
			'lodash',
			'react',
			'react-dom',
			'redux',
			'react-redux',
			'react-router',
			'react-bootstrap'
		],
		app: './index.jsx'
	},
	output: {
		path: path.resolve(__dirname, '../public'),
		publicPath: '/', // Path used for lazy loaded modules
		filename: '[name].js',
		chunkFilename: '[name].js' // Template based on keys in entry above
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (m) {
				if (m.context && [
						'core-js',
						'babel-runtime',
						'regenerator-runtime'
					].some(moduleName => m.context.includes(moduleName))) {
					return false;
				}
				return m.context && m.context.includes('node_modules');
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity
		})
	],
	module: {
		rules: [
			{
				test: /\.jsx*?$/,
				use: [
					'babel-loader'
				]
			}
		]
	},
	resolve: {
		modules: [
			path.resolve(__dirname, '../client'),
			'node_modules'
		],
		extensions: ['.js', '.json', '.jsx']
	}
};

module.exports = config;
