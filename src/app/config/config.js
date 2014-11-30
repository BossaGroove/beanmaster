var clone = require('clone'),
	_ = require('lodash');

var development = require('./config/development');
var office_dev = require('./config/office_dev');
var test = require('./config/test');
var production = require('./config/production');


var configs = {
	development: development,
	test: _.merge(clone(development), test),
	office_dev: _.merge(clone(development), office_dev),
	production: _.merge(clone(development), production)
};

module.exports = configs[process.env.NODE_ENV] || configs.development;
