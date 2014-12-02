/**
 * Created by Bossa on 2014/10/05.
 */

(function() {
	'use strict';

	var fs = require('fs');
	var _ = require('lodash');

	var config_path = __dirname + '/../app/config/beanstalk.json';

	function BeanstalkConfigManager() {
		this._cached_config = null;
	}

	BeanstalkConfigManager.prototype.getConfig = function(callback) {

		var _this = this;

		if (this._cached_config) {
			callback(null, this._cached_config);
		} else {
			fs.exists(config_path, function(exists) {
				if (exists) {
					fs.readFile(config_path, function(err, data) {
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
	};

	BeanstalkConfigManager.prototype.saveConfig = function(new_config, callback) {
		var data = JSON.stringify(new_config, null, '\t');

		var _this = this;

		fs.writeFile(config_path, data, function(err) {

			if (!err) {
				_this._cached_config = new_config;
			}

			callback(err, _this._cached_config);
		});
	};

	BeanstalkConfigManager.prototype.addConfig = function(input_config, callback) {

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
	};

	BeanstalkConfigManager.prototype.deleteConfig = function(input_config, callback) {

		var _this = this;

		this.getConfig(function(err, all_config) {
			if (err) {
				callback(err, null);
			} else {

				var config_to_be_deleted = _.findWhere(all_config, {host: input_config.host, port: input_config.port});

				if (config_to_be_deleted) {
					all_config = _.without(all_config, config_to_be_deleted)
				}

				_this.saveConfig(all_config, function(err, saved_config) {
					callback(err, saved_config);
				});

			}
		});
	};

	BeanstalkConfigManager.instance = null;

	BeanstalkConfigManager.getInstance = function() {
		if (this.instance === null) {
			this.instance = new BeanstalkConfigManager();
		}
		return this.instance;
	};

	module.exports = BeanstalkConfigManager.getInstance();

})();
