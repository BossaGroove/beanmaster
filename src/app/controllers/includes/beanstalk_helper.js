'use strict';

const _ = require('lodash');
const root = require('app-root-path');

const lib = require(`${root}/lib`);
const BeanstalkConnectionManager = lib.BeanstalkConnectionManager;

class BeanstalkHelper {
	static *getServerInfo(configs) {
		for (let i = 0; i < configs.length; i++) {
			let connection = yield BeanstalkConnectionManager.getConnection(configs[i].host, configs[i].port);
			configs[i].server_info = yield connection.statsAsync();
		}

		return configs;
	}
}

module.exports = BeanstalkHelper;
