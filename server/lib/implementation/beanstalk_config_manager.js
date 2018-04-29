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

		this._cachedConfig = null;
	}

	async getConfig() {
		if (this._cachedConfig) {
			return this._cachedConfig;
		}

		const pathExists = await (new Promise(function (resolve, reject) {
			fs.stat(BEANMASTER_CONFIG_PATH, function (err, stat) {
				if (err || !stat) {
					reject(err);
				} else {
					resolve(stat.isFile());
				}
			});
		}));

		if (!pathExists) {
			this._cachedConfig = [];
			return this._cachedConfig;
		}

		let configData = await (new Promise(function (resolve) {
			fs.readFile(BEANMASTER_CONFIG_PATH, function (err, data) {
				if (err) {
					resolve([]);
				} else {
					resolve(data);
				}
			});
		}));

		configData = configData.toString();

		try {
			this._cachedConfig = JSON.parse(configData);
		} catch (e) {
			this._cachedConfig = [];
		}

		return this._cachedConfig;
	}

	async saveConfig(newConfig) {
		const data = JSON.stringify(newConfig, null, '\t');

		await (new Promise((resolve, reject) => {
			fs.writeFile(BEANMASTER_CONFIG_PATH, data, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		}));

		this._cachedConfig = newConfig;

		return this._cachedConfig;
	}

	async addConfig(inputConfig) {
		const configs = await this.getConfig();

		// find if same config exists
		if (_.find(configs, {host: inputConfig.host, port: inputConfig.port})) {
			throw new Error('Connection already exists');
		}

		configs.push({
			name: inputConfig.name,
			host: inputConfig.host,
			port: inputConfig.port
		});

		return this.saveConfig(configs);
	}

	async deleteConfig(inputConfig) {
		let configs = await this.getConfig();

		const configToBeDeleted = _.find(configs, {host: inputConfig.host, port: inputConfig.port});

		if (configToBeDeleted) {
			configs = _.without(configs, configToBeDeleted);
		}

		return this.saveConfig(configs);
	}
}


module.exports = new BeanstalkConfigManager();
