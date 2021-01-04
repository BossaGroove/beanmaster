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
		'max-lines': 'off',
		'import/no-extraneous-dependencies': 'off',
		'react/no-array-index-key': 'off',
		'no-underscore-dangle': 'off',
		'comma-dangle': ['error', {
			arrays: 'ignore',
			objects: 'ignore',
			imports: 'ignore',
			exports: 'ignore',
			functions: 'ignore'
		}],
		'react/sort-comp': [2, {
			'order': [
				'constructor',
				'static-methods',
				'lifecycle',
				'everything-else',
				'render'
			]
		}],
		'no-shadow': [
			'error',
			{
				'allow': [
					'name',
					'history',
					'status',
					'location',
					'event'
				]
			}
		]
	}
};
