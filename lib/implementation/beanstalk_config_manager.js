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

	async getConfig() {
		if (this._cached_config) {
			return this._cached_config;
		}

		const path_exists = await (new Promise(function (resolve, reject) {
			fs.stat(BEANMASTER_CONFIG_PATH, function (err, stat) {
				if (err || !stat) {
					reject(err);
				} else {
					resolve(stat.isFile());
				}
			});
		}));

		if (!path_exists) {
			this._cached_config = [];
			return this._cached_config;
		}

		let config_data = await (new Promise(function (resolve, reject) {
			fs.readFile(BEANMASTER_CONFIG_PATH, function (err, data) {
				if (err) {
					resolve([]);
				} else {
					resolve(data);
				}
			});
		}));

		config_data = config_data.toString();

		try {
			this._cached_config = JSON.parse(config_data);
		} catch (e) {
			this._cached_config = [];
		}

		return this._cached_config;
	}

	async saveConfig(new_config) {
		let data = JSON.stringify(new_config, null, '\t');

		let _this = this;

		await (new Promise(function (resolve, reject) {
			fs.writeFile(BEANMASTER_CONFIG_PATH, data, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		}));

		_this._cached_config = new_config;

		return _this._cached_config;
	}

	async addConfig(input_config) {
		let configs = await this.getConfig();

		// find if same config exists
		if (_.find(configs, {host: input_config.host, port: input_config.port})) {
			throw new Error('Connection already exists');
		}

		configs.push({
			name: input_config.name,
			host: input_config.host,
			port: input_config.port
		});

		return await this.saveConfig(configs);
	}

	async deleteConfig(input_config) {
		let configs = await this.getConfig();

		let config_to_be_deleted = _.find(configs, {host: input_config.host, port: input_config.port});

		if (config_to_be_deleted) {
			configs = _.without(configs, config_to_be_deleted);
		}

		return await this.saveConfig(configs);
	}
}


module.exports = new BeanstalkConfigManager();
