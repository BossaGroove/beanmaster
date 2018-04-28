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
		}],
		"react/sort-comp": [2, {
			"order": [
				"constructor",
				"static-methods",
				"lifecycle",
				"everything-else",
				"render"
			]
		}]
	}
};
