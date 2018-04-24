

const changeCase = require('change-case');
const requireAll = require('require-all');

module.exports = requireAll({
	dirname: `${__dirname}/implementation`,
	map: changeCase.pascalCase
});
