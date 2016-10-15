'use strict';

const changeCase = require('change-case');
const app_root = require('app-root-path');
const requireAll = require('require-all');

module.exports = requireAll({
	dirname: `${app_root}/app/controllers/implementation`,
	map: changeCase.pascalCase
});
