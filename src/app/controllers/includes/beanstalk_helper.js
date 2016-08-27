'use strict';

const _ = require('lodash');
const root = require('app-root-path');

const lib = require(`${root}/lib`);
const BeanstalkConnectionManager = lib.BeanstalkConnectionManager;

class BeanstalkHelper {
	static *getServerInfo(configs) {
		let connection_generators = [];

		for (let i = 0; i < configs.length; i++) {
			connection_generators.push(BeanstalkConnectionManager.getConnection(configs[i].host, configs[i].port));
		}


		let connections = yield connection_generators;

		/*
				let config_with_detail = _.cloneDeep(config);
				config_with_detail.server_info = {};

				if (!err) {
					connection.stats(function (err, results) {
						config_with_detail.server_info = results;
						flow_callback(null, config_with_detail);
					});
				} else {
					flow_callback(null, config_with_detail);
				}*/
	}
}

module.exports = BeanstalkHelper;
