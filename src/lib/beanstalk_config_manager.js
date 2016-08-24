/**
 * Created by Bossa on 2014/10/05.
 */

'use strict';

const fs = require('fs');
const _ = require('lodash');
const Utility = require('./utility');

const BEANMASTER_HOME_PATH = Utility.getHomePath();
const BEANMASTER_CONFIG_PATH = BEANMASTER_HOME_PATH + '/config.json';

class BeanstalkConfigManager {
	constructor() {
		if (!fs.existsSync(BEANMASTER_HOME_PATH)) {
			fs.mkdirSync(BEANMASTER_HOME_PATH);
		}

		if (!fs.existsSync(BEANMASTER_CONFIG_PATH)) {
			fs.writeFileSync(BEANMASTER_CONFIG_PATH);
		}

		this._cached_config = null;
	}

	getConfig(callback) {

		var _this = this;

		if (this._cached_config) {
			callback(null, this._cached_config);
		} else {
			fs.exists(BEANMASTER_CONFIG_PATH, function(exists) {
				if (exists) {
					fs.readFile(BEANMASTER_CONFIG_PATH, function(err, data) {
						if (err) {
							_this._cached_config = [];
							callback(null, _this._cached_config);
						} else {

							data = data.toString();

							try {
								_this._cached_config = JSON.parse(data);
							} catch (e) {
								_this._cached_config = [];
							}
							callback(null, _this._cached_config);
						}
					});
				} else {
					_this._cached_config = [];
					callback(null, _this._cached_config);
				}
			});
		}
	}

	saveConfig(new_config, callback) {
		var data = JSON.stringify(new_config, null, '\t');

		var _this = this;

		fs.writeFile(BEANMASTER_CONFIG_PATH, data, function(err) {

			if (!err) {
				_this._cached_config = new_config;
			}

			callback(err, _this._cached_config);
		});
	}

	addConfig(input_config, callback) {

		var _this = this;

		this.getConfig(function(err, all_config) {
			if (err) {
				callback(err, null);
			} else {
				var existing_config = _.find(all_config, {host: input_config.host, port: input_config.port});

				if (existing_config) {
					callback(null, all_config);
				} else {
					all_config.push(input_config);

					_this.saveConfig(all_config, function(err, saved_config) {
						callback(err, saved_config);
					});
				}
			}
		});
	}

	deleteConfig(input_config, callback) {

		var _this = this;

		this.getConfig(function(err, all_config) {
			if (err) {
				callback(err, null);
			} else {

				var config_to_be_deleted = _.findWhere(all_config, {host: input_config.host, port: input_config.port});

				if (config_to_be_deleted) {
					all_config = _.without(all_config, config_to_be_deleted);
				}

				_this.saveConfig(all_config, function(err, saved_config) {
					callback(err, saved_config);
				});

			}
		});
	}
}


module.exports = new BeanstalkConfigManager();
