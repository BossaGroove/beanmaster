const path = require('path');

const resourceFolder = path.resolve(__dirname, '../client');
const BabelPluginTransformImports = require('babel-plugin-transform-imports');

const config = {
	mode: process.env.NODE_ENV || 'development',
	context: resourceFolder,
	entry: {
		app: './index.jsx'
	},
	output: {
		path: path.resolve(__dirname, '../public'),
		publicPath: '/', // Path used for lazy loaded modules
		filename: '[name].js',
		chunkFilename: '[name].js' // Template based on keys in entry above
	},
	plugins: [

	],
	optimization: {
		splitChunks: {
			name: false,
			cacheGroups: {
				appVendor: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendor',
				},
			},
		}
	},
	module: {
		rules: [
			{
				test: /\.jsx*?$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: [
								[
									BabelPluginTransformImports,
									{
										'react-bootstrap': {
											'transform': function (importName) {
												return `react-bootstrap/es/${importName}`;
											},
											preventFullImport: true
										},
										'lodash-es': {
											'transform': function (importName) {
												return `lodash-es/${importName}`;
											},
											preventFullImport: true
										},
										'validator': {
											'transform': function (importName) {
												return `validator/lib/${importName}`;
											},
											preventFullImport: true
										},
										'redux-form': {
											'transform': function (importName) {
												return `redux-form/es/${importName}`;
											},
											preventFullImport: true
										}
									}
								]
							]
						}

					}
				]
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
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							mimetype: 'image/svg+xml'
						}
					}
				]
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
		]
	},
	resolve: {
		modules: [
			path.resolve(__dirname, '../client'),
			'node_modules'
		],
		fallback: {
			http: false,
			https: false,
			zlib: false,
			tty: false,
			stream: false,
			os: false
		},
		extensions: ['.js', '.json', '.jsx']
	}
};

module.exports = config;
