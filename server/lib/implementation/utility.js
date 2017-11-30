/**
 * Created by Bossa on 10/12/14.
 */

'use strict';

const path = require('path');
const validator = require('validator');

class Utility {
	/**
	 * @param {string} host_port
	 * @returns {*}
	 */
	static validateHostPort(host_port) {
		if (!host_port) {
			return false;
		}

		const [host, port] = host_port.split(':');

		if ((!validator.isURL(host) && !validator.isIP(host)) || !validator.isNumeric(port)) {
			return false;
		}

		return host_port;
	}

	static getHomePath() {
		let beanmaster_home_path = '';

		if (process.env.BEANMASTER_HOME) {
			beanmaster_home_path = process.env.BEANMASTER_HOME;
		} else {
			beanmaster_home_path = path.resolve(process.env.HOME || process.env.HOMEPATH, '.beanmaster');
		}

		return beanmaster_home_path;
	}
}

module.exports = Utility;
