'use strict';

const path = require('path');
const webpack = require('webpack');
const resourceFolder = path.resolve(__dirname, '../client');

const config = {
	context: resourceFolder,
	entry: {
		vendor: [
			// 'brace',
			// 'brace/mode/json',
			// 'brace/theme/twilight',
			// 'brace/theme/chrome',
			// 'immutable',
			// 'lodash',
			// 'moment',
			// 'moment-timezone',
			// 'omit-empty',
			'react',
			'react-dom',
			// 'react-ace',
			// 'react-redux',
			// 'redux',
			// 'react-dates',
			// 'react-select-plus',
			'react-router',
			'react-bootstrap',
			// 'redux-saga',
			// 'react-immutable-proptypes'
		],
		// polyfill: './polyfill.js',
		// ga: './ga.js',
		app: './index.jsx'
	},
	output: {
		path: path.resolve(__dirname, '../public'),
		publicPath: '/', // Path used for lazy loaded modules
		filename: '[name].js',
		chunkFilename: '[name].js' // Template based on keys in entry above
	},
	// externals: {
	// 	stripe: 'Stripe'
	// },
	plugins: [
		new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (m) {
				if (m.context && [
						'core-js',
						'babel-runtime',
						'regenerator-runtime',
						'whatwg-fetch'
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
			},
			{
				test: /\.svg$/,
				use: [
					'babel-loader',
					'react-svg-loader?jsx=true'
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
