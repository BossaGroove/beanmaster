module.exports = {
	extends: 'aftership/react',
	settings: {
		'import/resolver': {
			webpack: {
				config: 'webpack.config.js'
			}
		}
	},
	rules: {
		'comma-dangle': ['error', {
			arrays: 'ignore',
			objects: 'ignore',
			imports: 'ignore',
			exports: 'ignore',
			functions: 'ignore'
		}]
	}
};
