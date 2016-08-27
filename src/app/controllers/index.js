'use strict';

const changeCase = require('change-case');
const root = require('app-root-path');
const requireAll = require('require-all');

module.exports = requireAll({
	dirname: `${root}/app/controllers/implementation`,
	map: changeCase.pascalCase
});
